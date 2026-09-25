import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { LovePosterService } from '../services/love-poster.service';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  private fb = inject(FormBuilder);
  private posterService = inject(LovePosterService);

  posterUrl = '';
  imagePreview = '';

  isSubmitting = false;
  isCompressing = false;

  imageSizeKB = 0;

  posterForm = this.fb.group({

    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(100)
      ]
    ],

    image: [
      '',
      Validators.required
    ],

    message: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]
    ]

  });


  /**
   * Handle image selection
   */
  async onImageSelected(event: Event): Promise<void> {

    const input =
      event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Basic validation
    if (!file.type.startsWith('image/')) {

      alert('Please select a valid image.');

      input.value = '';

      return;
    }

    this.isCompressing = true;

    try {

      console.log(
        'Original image:',
        this.formatBytes(file.size)
      );

      /**
       * Compress and resize image
       */
      const compressedBase64 =
        await this.compressImage(file);

      /**
       * Calculate final Base64 size
       */
      const sizeInBytes =
        this.getBase64Size(compressedBase64);

      this.imageSizeKB =
        Math.round(sizeInBytes / 1024);

      console.log(
        'Compressed Base64:',
        this.imageSizeKB,
        'KB'
      );

      /**
       * Preview
       */
      this.imagePreview =
        compressedBase64;

      /**
       * Store Base64 in form
       */
      this.posterForm.patchValue({

        image: compressedBase64

      });

    } catch (error) {

      console.error(
        'Image compression failed:',
        error
      );

      alert(
        'Unable to process this image. Please try another image.'
      );

    } finally {

      this.isCompressing = false;

    }

  }


  /**
   * Compress image and convert it to Base64
   */
  private async compressImage(
    file: File
  ): Promise<string> {

    const image =
      await this.loadImage(file);

    /**
     * Maximum dimensions
     *
     * 600x600 is more than enough
     * for your romantic poster.
     */
    const maxWidth = 600;
    const maxHeight = 600;

    let width = image.naturalWidth;
    let height = image.naturalHeight;


    /**
     * Calculate resize ratio
     */
    if (
      width > maxWidth ||
      height > maxHeight
    ) {

      const ratio =
        Math.min(
          maxWidth / width,
          maxHeight / height
        );

      width =
        Math.round(width * ratio);

      height =
        Math.round(height * ratio);

    }


    /**
     * Create canvas
     */
    const canvas =
      document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;


    const context =
      canvas.getContext('2d');

    if (!context) {

      throw new Error(
        'Canvas is not supported by this browser.'
      );

    }


    /**
     * Better image rendering
     */
    context.imageSmoothingEnabled = true;

    context.imageSmoothingQuality = 'high';


    /**
     * Draw resized image
     */
    context.drawImage(
      image,
      0,
      0,
      width,
      height
    );


    /**
     * Target size
     *
     * JSON Server limit:
     * 102400 bytes
     *
     * We intentionally target
     * around 65 KB so that the
     * complete JSON request stays
     * safely below 100 KB.
     */
    const targetSize =
      65 * 1024;


    /**
     * Start with good quality
     */
    let quality = 0.80;

    let base64 =
      canvas.toDataURL(
        'image/jpeg',
        quality
      );


    /**
     * Reduce quality until
     * image is small enough.
     */
    while (

      this.getBase64Size(base64)
        > targetSize

      && quality > 0.20

    ) {

      quality -= 0.05;

      base64 =
        canvas.toDataURL(
          'image/jpeg',
          quality
        );

    }


    /**
     * If still too large,
     * progressively reduce
     * dimensions.
     */
    let currentWidth = width;
    let currentHeight = height;

    while (

      this.getBase64Size(base64)
        > targetSize

      && currentWidth > 300

    ) {

      currentWidth =
        Math.round(currentWidth * 0.85);

      currentHeight =
        Math.round(currentHeight * 0.85);


      canvas.width = currentWidth;
      canvas.height = currentHeight;


      context.clearRect(
        0,
        0,
        currentWidth,
        currentHeight
      );


      context.drawImage(
        image,
        0,
        0,
        currentWidth,
        currentHeight
      );


      /**
       * Reset quality after
       * resizing.
       */
      quality = 0.75;

      base64 =
        canvas.toDataURL(
          'image/jpeg',
          quality
        );


      /**
       * Reduce quality again if needed.
       */
      while (

        this.getBase64Size(base64)
          > targetSize

        && quality > 0.20

      ) {

        quality -= 0.05;

        base64 =
          canvas.toDataURL(
            'image/jpeg',
            quality
          );

      }

    }


    /**
     * Final safety check
     */
    const finalSize =
      this.getBase64Size(base64);


    if (finalSize > 80 * 1024) {

      throw new Error(
        'Unable to compress image below safe size.'
      );

    }


    return base64;

  }


  /**
   * Load image into browser
   */
  private loadImage(
    file: File
  ): Promise<HTMLImageElement> {

    return new Promise(
      (resolve, reject) => {

        const reader =
          new FileReader();


        reader.onload = () => {

          const image =
            new Image();


          image.onload = () => {

            resolve(image);

          };


          image.onerror = () => {

            reject(
              new Error(
                'Unable to load image.'
              )
            );

          };


          image.src =
            reader.result as string;

        };


        reader.onerror = () => {

          reject(
            new Error(
              'Unable to read image.'
            )
          );

        };


        reader.readAsDataURL(file);

      }
    );

  }


  /**
   * Calculate Base64 size
   */
  private getBase64Size(
    base64: string
  ): number {

    const base64Data =
      base64.split(',')[1] || '';


    /**
     * Base64 decoded size
     */
    return Math.ceil(
      (base64Data.length * 3) / 4
    );

  }


  /**
   * Format bytes for console
   */
  private formatBytes(
    bytes: number
  ): string {

    if (bytes === 0) {
      return '0 Bytes';
    }

    const units = [
      'Bytes',
      'KB',
      'MB'
    ];

    const index =
      Math.floor(
        Math.log(bytes) /
        Math.log(1024)
      );

    return (
      parseFloat(
        (
          bytes /
          Math.pow(1024, index)
        ).toFixed(2)
      )
      +
      ' '
      +
      units[index]
    );

  }


  /**
   * Create Love Poster
   */
  createPoster(): void {

    if (this.posterForm.invalid) {

      this.posterForm.markAllAsTouched();

      return;

    }


    /**
     * Don't submit while image
     * compression is happening.
     */
    if (this.isCompressing) {

      alert(
        'Please wait while the image is being optimized.'
      );

      return;

    }


    this.isSubmitting = true;


    const poster = {

      id: this.generateId(),

      name:
        this.posterForm.value.name!.trim(),

      image:
        this.posterForm.value.image!,

      message:
        this.posterForm.value.message!.trim()

    };


    console.log(
      'Sending poster:',
      {
        id: poster.id,
        name: poster.name,
        imageSize:
          this.imageSizeKB + ' KB',
        messageLength:
          poster.message.length
      }
    );


    this.posterService
      .createPoster(poster)
      .subscribe({

        next: response => {

          console.log(
            'Poster created:',
            response
          );


          this.isSubmitting = false;


          /**
           * Generate public URL
           */
          this.posterUrl =
            `${window.location.origin}/user/${response.id}`;


          /**
           * Optional: scroll to
           * generated URL
           */
          setTimeout(() => {

            document
              .querySelector('.success-box')
              ?.scrollIntoView({
                behavior: 'smooth'
              });

          }, 100);

        },


        error: error => {

          console.error(
            'Create poster error:',
            error
          );


          this.isSubmitting = false;


          if (
            error.status === 413
          ) {

            alert(
              'Image is still too large. Please select a smaller image.'
            );

          } else {

            alert(
              'Unable to create the Love Poster. Please try again.'
            );

          }

        }

      });

  }


  /**
   * Generate unique ID
   */
  private generateId(): string {

    return crypto
      .randomUUID()
      .replace(/-/g, '')
      .substring(0, 8);

  }


  /**
   * Copy generated URL
   */
  copyLink(): void {

    if (!this.posterUrl) {
      return;
    }


    navigator.clipboard
      .writeText(this.posterUrl)
      .then(() => {

        alert(
          'Love Poster link copied! ❤️'
        );

      })
      .catch(error => {

        console.error(
          'Copy failed:',
          error
        );

      });

  }

}