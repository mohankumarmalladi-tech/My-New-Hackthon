let model;

async function loadModel() {
  model = await tf.loadLayersModel('model/model.json');
  console.log("Model loaded.");
}
loadModel();

document.getElementById('imageUpload').addEventListener('change', function (e) {
  const reader = new FileReader();
  reader.onload = function () {
    document.getElementById('preview').src = reader.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

async function predict() {
  if (!model) {
    alert("Model not loaded yet!");
    return;
  }

  const img = document.getElementById('preview');
  const tensor = tf.browser.fromPixels(img)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .div(tf.scalar(255.0))
    .expandDims();

  const prediction = await model.predict(tensor).data();
  const classNames = ["Healthy", "Leaf Spot", "Blight", "Rust"]; // your class names

  const maxIndex = prediction.indexOf(Math.max(...prediction));
  const resultText = `Detected: ${classNames[maxIndex]}`;
  document.getElementById('result').innerText = resultText;
}
