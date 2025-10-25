// Función para subir archivos a IPFS usando Pinata API REST
export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    console.log('Subiendo archivo a IPFS con Pinata...', file.name);
    
    // Debug: verificar variables de entorno
    console.log('API Key existe:', !!process.env.NEXT_PUBLIC_PINATA_API_KEY);
    console.log('Secret Key existe:', !!process.env.NEXT_PUBLIC_PINATA_SECRET_KEY);
    
    const formData = new FormData();
    formData.append('file', file);
    
    // Metadatos adicionales
    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append('pinataMetadata', metadata);
    
    // Opciones de Pinata
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);
    
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY!,
        'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_KEY!,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Archivo subido exitosamente:', result.IpfsHash);
    return result.IpfsHash;
  } catch (error) {
    console.error('Error subiendo a IPFS:', error);
    throw new Error('Error al subir archivo a IPFS');
  }
};

// Función para subir texto a IPFS
export const uploadTextToIPFS = async (text: string, filename: string = 'story.txt'): Promise<string> => {
  try {
    console.log('Subiendo texto a IPFS con Pinata...', filename);
    
    const formData = new FormData();
    const blob = new Blob([text], { type: 'text/plain' });
    const file = new File([blob], filename, { type: 'text/plain' });
    formData.append('file', file);
    
    // Metadatos adicionales
    const metadata = JSON.stringify({
      name: filename,
    });
    formData.append('pinataMetadata', metadata);
    
    // Opciones de Pinata
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);
    
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY!,
        'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_KEY!,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Texto subido exitosamente:', result.IpfsHash);
    return result.IpfsHash;
  } catch (error) {
    console.error('Error subiendo texto a IPFS:', error);
    throw new Error('Error al subir texto a IPFS');
  }
};

// Función para obtener URL de IPFS
export const getIPFSURL = (hash: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};

// Función para obtener metadatos de un archivo
export const getFileMetadata = async (hash: string) => {
  try {
    const response = await fetch(`https://api.pinata.cloud/data/pinList?hashContains=${hash}`, {
      method: 'GET',
      headers: {
        'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY!,
        'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_KEY!,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.rows[0];
  } catch (error) {
    console.error('Error obteniendo metadatos:', error);
    return null;
  }
};