window.addEventListener("load", function () {
  const divs = document.querySelectorAll("div[id*='gaugChart_']");
  for (const div of divs) {
    createGaugeChart(div);
  }
});

function createGaugeChart(div) {
  const gaugeChart = echarts.init(div);
  const value = "1000";
  const title = div.getAttribute("data-title");
  const color = div.getAttribute("data-color");

  const gaugeData = [
    {
      value: value,
      name: title,
      title: {
        offsetCenter: ["0%", "0%"],
        fontSize: 18,
        color: "#fff",
      },
      detail: {
        show: false,
      },
    },
  ];
  option = {
    series: [
      {
        silent: true,
        type: "gauge",
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
            borderColor: color,
            color: color,
          },
        },
        axisLine: {
          lineStyle: {
            width: 12,
            color: [[1, "rgba(171, 171, 171, 0.16)"]],
          },
          pointer: false,
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 9,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          distance: 50,
        },
        data: gaugeData,
      },
    ],
  };

  gaugeChart.setOption(option);
}
