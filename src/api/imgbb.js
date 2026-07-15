import axios from 'axios';

// Uploads a File to imgBB and returns the hosted image URL.
// Needs VITE_IMGBB_API_KEY in .env — get a free key at https://api.imgbb.com/
export const uploadToImgBB = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    formData
  );

  return res.data.data.url;
};
