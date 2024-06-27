import { CommonModule } from '@angular/common';
import { Component,ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {uploadFile} from'../firebase/config'
interface ImageFile {
  dataUrl: string;
  timestamp: Date;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'badgertelecompro';
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  capturedImages: ImageFile[] = [];

  ngOnInit() {
    this.setupCamera();
  }

  setupCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch(error => {
        console.error('Error accessing the camera:', error);
      });
  }

  takeSnapshot() {
    if (this.canvasElement && this.canvasElement.nativeElement) {
      const context = this.canvasElement.nativeElement.getContext('2d');
      if (context) {
        if (this.videoElement && this.videoElement.nativeElement) {
          context.drawImage(this.videoElement.nativeElement, 0, 0, 640, 480);
          const imageData = this.canvasElement.nativeElement.toDataURL('image/jpeg');
          this.addImageToList(imageData);
        } else {
          console.error('Video element not found or initialized.');
        }
      } else {
        console.error('Canvas context is null.');
      }
    } else {
      console.error('Canvas element not found or initialized.');
    }
  }


  addImageToList(imageData: string) {
    const newImage: ImageFile = {
      dataUrl: imageData,
      timestamp: new Date()
    };
    this.capturedImages.unshift(newImage); // Agrega la imagen al inicio de la lista
  }

  uploadImages() {
    this.capturedImages.forEach(image => {
      // Convertir dataUrl a Blob
    debugger;
      const byteString = atob(image.dataUrl.split(',')[1]);
      const mimeString = image.dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      uploadFile(blob);

    });
  }

}
