# sparklib - Small Charts, Big Impact

A lightweight library featuring a fluid API for easy creation of sparkline charts. Separate packages with components for [Angular](https://www.npmjs.com/package/ngx-sparklib) and [React](https://www.npmjs.com/package/react-sparklib) are available.

The library currently offers support for line charts, area charts, stripe charts and basic axes.

> **Note**: Documentation is very much work in progress and currently lacking in detail.

## What is a Sparkline Chart?

A sparkline is a minimalist, word-sized graphic that shows data trends with typographic clarity. In its most basic form, a sparkline lacks axes, labels, and gridlines, although **sparklib** offers some support for these elements. Sparklines can be seamlessly embedded in text, tables, or headlines to provide a quick, contextual view of data variations.

![Basic line charts in a table](docs/images/sparklib-weather-table.png)

## What Isn't a Sparkline Chart?

Sparklines are not suited for detailed data analysis requiring full support for axes, labels, legends, or gridlines. If you need these features or interactivity, consider using a full-fledged charting library like [Chart.js](https://www.chartjs.org/).

## Examples

### Line and Area Charts

<details>

<summary>Basic chart</summary>

```ts
const data: number[] = [16, 15.1, 10, 14.2 /* ... */];

const chart = lineChart()
    .width(data.length)
    .height(40)
    .background('lightyellow')
    .render(data);
```

</details>

![Basic line chart](docs/images/sl-ac-g-weather-0.png)

<details>

<summary>Basic chart with a horizontal gradient</summary>

```ts
const data: number[] = [16, 15.1, 10, 14.2 /* ... */];

const chart = lineChart()
  .width(data.length)
  .height(40)
  .background('lightyellow')
  .fillStyle(
    // horizontal gradient
    linearGradient(0, 0, data.length, 0)
        .addColorStop(0, 'lightgreen')
        .addColorStop(1, 'black'))
  .render(data);
```

</details>

![Basic line chart with horizontal gradient](docs/images/sl-ac-g-weather-2.png)

![Basic line chart with complex gradient](docs/images/sl-ac-g-weather-1.png)

<details>

<summary>Basic chart with a vertical gradient</summary>

```ts
const data: number[] = [16, 15.1, 10, 14.2 /* ... */];
const height = 40;

const chart = lineChart()
  .width(data.length)
  .height(height)
  .background('lightyellow')
  .fillStyle(
      // vertical gradient
      linearGradient(0, 0, 0, height)
          .addColorStop(0.0, '#67001f')
          .addColorStop(0.1, '#b2182b')
          // ... more color stops
          .addColorStop(0.9, '#2166ac')
          .addColorStop(1.0, '#053061'))
  .render(data);
```

</details>

![Basic line chart with vertical gradient](docs/images/sl-ac-g-weather-3.png)

Gaps in your data series are handled gracefully.

![Basic line chart with gaps in data](docs/images/sl-ac-g-weather-gaps-0.png)

### Stripe Charts

Stripe charts visualize numerical data through vertical stripes, where the length or color intensity can represent values or frequencies. They are particularly effective for displaying dozens of time series in a single view. The examples below are somewhat contrieved but demonstrate what is possible.

![Basic binned stripe chart](docs/images/sl-sc-monotonic-binned.png)

![Basic smooth stripe chart](docs/images/sl-sc-monotonic-smooth.png)

![Basic gradient stripe chart](docs/images/sl-sc-random-pride.png)

<details>

<summary>Simple stripes using a white to red gradient</summary>

```ts
const data = [0, 4.5, 0, 0, 0, 0 /* ... */];

const gradient = ['white', 'red'];

const chart = stripeChart()
        .width(data.length)
        .height(25)
        .gradientColors(gradient, gradient.length)
        .render(data);
```

</details>

![Basic simple stripe chart](docs/images/sl-sc-random-red.png)

You can even make barcodes with **sparklib**. Here's the text "SPARKLIB" in [Code 39](https://en.wikipedia.org/wiki/Code_39) barcode format.

<details>
<summary>Barcode</summary>

```ts
barcodeData = [1, 0, 0, 1, 0, 1, 1 /* ... SPARKLIB */];

const chart = stripeChart()
  .width(barcodeData.length * 2)
  .height(40)
  .render(barcodeData);
```

</details>

![Barcode stripe chart](docs/images/sl-sc-code39-barcode.png)

## Axes

To enhance the readability and context of sparkline data, Sparklib offers the functionality to create axes as individual canvas elements. These axes can be placed on any side of a chart - top, left, right, or bottom. Additionally, each axis is fully customizable, allowing adjustments in line width, color, font, labels, and tick positions.

The axes support is very basic and if you need more advanced capabilities, please look to another charting library.

<details>
<summary>If you create a horizontal top x axis like this:</summary>

```ts
    const ticks: AxisTick[] = [
      { label: '', position: 0 },
      { label: 'March', position: 62 },
      { label: 'June', position: 127 },
      { label: 'September', position: 187 },
      { label: '', position: 250 },
    ];

    const xAxis = axis()
      .position(AxisPosition.Top)
      .width(250)
      .height(30)
      .font('10px arial')
      .ticks(ticks)
      .render();
```

</details>

![Horizontal top x axis](docs/images/sl-ax-horizontal-top-axis.png)

And have a sparkline chart like this:

![Horizontal top x axis](docs/images/sl-ax-horizontal-top-chart.png)

You can then combine them with HTML and CSS markup like this:

![Horizontal top x axis](docs/images/sl-ax-horizontal-top-axis-and-chart.png)

Axes are available for all sides of a chart (top, left, right and bottom). The example below uses a HTML \<table> to position the axes and line chart relative to each other.

![Chart with top, left, right and bottom axes](docs/images/sl-ax-axes-and-chart.png)

There are several styling options available if you need more fancy axes:

![Horizontal bottom x axis with gradient](docs/images/sl-ax-horizontal-bottom-fancy-chart.png)

## Further Reading

The concept of miniaturized data visualization has historical antecedents, but the term 'sparkline' and its modern interpretation were formalized by Edward Tufte in his 2006 book, [Beautiful Evidence](https://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0001OR).

Wikipedia also has an entry for [sparklines](https://en.wikipedia.org/wiki/Sparkline).

```

```
