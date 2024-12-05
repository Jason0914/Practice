fetch('/get-prediction', { // 假設您的 Java 後端 API 路徑
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ days: 30 })
})
.then(response => response.json())
.then(data => {
    const labels = data.map(item => item.ds);
    const values = data.map(item => item.yhat);

    // 使用 Chart.js 繪製圖表
    new Chart(document.getElementById('forecastChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '需求預測',
                data: values,
                borderWidth: 2
            }]
        }
    });
})
.catch(error => console.error('Error fetching prediction:', error));
