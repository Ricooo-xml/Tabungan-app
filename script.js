let data = JSON.parse(localStorage.getItem("catatanTabungan") || "[]");
let target = localStorage.getItem("targetTabungan") || "";
document.getElementById("target").value = target;
render();

function tambahCatatan() {
  const catatan = document.getElementById("catatan").value;
  const jumlah = parseInt(document.getElementById("jumlah").value);
  if (catatan && !isNaN(jumlah)) {
    data.push({ catatan, jumlah, waktu: new Date().toISOString() });
    localStorage.setItem("catatanTabungan", JSON.stringify(data));
    render();
  }
}

document.getElementById("target").addEventListener("change", () => {
  localStorage.setItem("targetTabungan", document.getElementById("target").value);
  render();
});

function render() {
  const daftar = document.getElementById("daftar");
  daftar.innerHTML = "";
  let total = 0;
  data.forEach(item => {
    total += item.jumlah;
    const li = document.createElement("li");
    li.textContent = `${item.catatan}: Rp${item.jumlah.toLocaleString()}`;
    daftar.appendChild(li);
  });

  const target = parseInt(localStorage.getItem("targetTabungan") || "0");
  const sisa = target - total;
  document.getElementById("sisaTarget").textContent =
    `Sisa dari target Rp${target.toLocaleString()}: Rp${sisa.toLocaleString()}`;

  // Render Chart
  const ctx = document.getElementById("grafik").getContext("2d");
  const labels = data.map(d => new Date(d.waktu).toLocaleDateString());
  const values = data.map(d => d.jumlah);
  if (window.tabunganChart) window.tabunganChart.destroy();
  window.tabunganChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Tabungan Harian",
        data: values,
        borderColor: "black",
        fill: false,
      }],
    },
  });
}