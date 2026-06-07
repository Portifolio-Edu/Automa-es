// Parse the stdout from the Execute Command node (which ran the Python script)
const result = JSON.parse($input.first().json.stdout);

if (result.error) {
  throw new Error("Python script error: " + result.error);
}

// Convert the array of clips into multiple n8n items
// This allows subsequent nodes (like Google Drive Upload) to process each clip individually.
const items = result.clips.map((clipPath) => {
  return {
    json: {
      filePath: clipPath,
      fileName: clipPath.split('/').pop()
    }
  };
});

return items;
