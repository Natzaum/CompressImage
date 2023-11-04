async function compressImage() {
  const fileInput = document.getElementById('fileInput');
  const originalImage = document.getElementById('originalImage');
  const compressedImage = document.getElementById('compressedImage');
  const originalSizeElement = document.getElementById('originalSize');
  const compressedSizeElement = document.getElementById('compressedSize');

  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(event) {
    const img = new Image();
    img.src = event.target.result;

    img.onload = async function() {
      const originalSize = formatBytes(file.size); 
      originalSizeElement.innerText = `Tamanho Original: ${originalSize}`;

      const compressedFile = await compress(img);
      const compressedSize = formatBytes(compressedFile.size); 
      compressedSizeElement.innerText = `Tamanho Comprimido: ${compressedSize}`;

      const compressedUrl = URL.createObjectURL(compressedFile);
      originalImage.src = img.src;
      compressedImage.src = compressedUrl;
    };
  };
  reader.readAsDataURL(file);
}

async function compress(img) {
  const maxWidth = 800; 
  const maxHeight = 600; 
  const quality = 1 / 100;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  let width = img.width;
  let height = img.height;

  if (width > height) {
    if (width > maxWidth) {
      height *= maxWidth / width;
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width *= maxHeight / height;
      height = maxHeight;
    }
  }

  canvas.width = width;
  canvas.height = height;

  context.drawImage(img, 0, 0, width, height);
  const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

  const compressedFile = await urltoFile(compressedDataUrl, 'compressed.jpg');
  return compressedFile;
}

function urltoFile(url, filename) {
  return (fetch(url)
    .then(function(res) { return res.arrayBuffer(); })
    .then(function(buf) { return new File([buf], filename, { type: 'image/jpeg' }); })
  );
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}