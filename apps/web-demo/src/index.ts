import { sparklib } from 'sparklib';

const data = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 7, 5, 3, 2, 1, -1, -2, -5, -7, -2, 3, 4, 5, 6, 7,
  8, 6, 5, 4, 2, 1, 1, 1, 6, 7, 7, 8, 9, 0,
];

document.addEventListener('DOMContentLoaded', () => {
  const div0 = document.createElement('div');
  document.body.appendChild(div0);

  const chart0 = sparklib()
    .lineChart()
    .width(250)
    .height(40)
    .background('lightyellow')
    .fillStyle(
      sparklib()
        .linearGradient(0, 0, 250, 0)
        .addColorStop(0, 'lightgreen')
        .addColorStop(1, 'black'),
    )
    .render(data);
  div0.appendChild(chart0);

  const br1 = document.createElement('br');
  document.body.appendChild(br1);
  const div1 = document.createElement('div');
  document.body.appendChild(div1);

  const chart1 = sparklib()
    .barChart()
    .width(250)
    .height(40)
    .background('lightyellow')
    .fillStyle(
      sparklib()
        .linearGradient(0, 0, 250, 0)
        .addColorStop(0, 'lightgreen')
        .addColorStop(1, 'black'),
    )
    .render(data);
  div1.appendChild(chart1);

  const br2 = document.createElement('br');
  document.body.appendChild(br2);
  const div2 = document.createElement('div');
  document.body.appendChild(div2);

  const chart2 = sparklib()
    .stripeChart()
    .width(250)
    .height(40)
    .gradientColors(['white', 'lightgreen', 'black'])
    .nGradientColorLevels(data.length)
    .render(data);
  div2.appendChild(chart2);
});
