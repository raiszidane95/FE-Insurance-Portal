function handleCopy(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Text copied to clipboard!');
    })
    .catch((err) => {
      console.error('Failed to copy: ', err);
    });
}

export default handleCopy;