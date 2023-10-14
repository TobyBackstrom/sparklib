/**
 * Retrieves the relevant indices from an array based on a given pixel position.
 * The function accounts for cases where the array length is both greater and
 * less than the pixel canvas width.
 *
 * @remarks
 * This function is especially useful when mapping data points in a dense array
 * to a smaller pixel canvas, or conversely, when the canvas width exceeds the number
 * of data points.
 *
 * @param pixelX - The pixel position on the canvas for which indices are required.
 * @param pixelWidth - The width of the canvas in pixels.
 * @param nValues - The length of the data array.
 *
 * @returns An object containing:
 * - `startIndex`: The starting index of the data array that corresponds to the `pixelX`.
 * - `endIndex`: The ending index of the data array that corresponds to the `pixelX` (this may be the same as the `startIndex` if there's a 1-to-1 mapping).
 * - `closestIndex`: In scenarios where `pixelX` is between two indices, this represents the index closer to the `pixelX`.
 *
 * @example
 * ```typescript
 * getIndicesForPixelX(28, 10, 100);
 * // Expected output:
 * // {
 * //   startIndex: 2,
 * //   endIndex: 3,
 * //   closestIndex: 2
 * // }
 * ```
 *
 * @throws If the data length (n) or canvas width is 0 or negative.
 * @throws If pixelX is out of the bounds of the canvas width.
 *
 */
export function getIndicesForPixelX(
  pixelX: number,
  pixelWidth: number,
  nValues: number,
): {
  startIndex: number;
  endIndex: number;
  closestIndex: number;
} {
  // Helper function to reduce repetition
  const createIndices = (start: number, end: number, closest: number) => ({
    startIndex: start,
    endIndex: end,
    closestIndex: closest,
  });

  if (nValues <= 0 || pixelWidth <= 0) {
    throw new Error(
      'Data length (n) and canvas width must both be greater than 0.',
    );
  }

  if (pixelX < 0 || pixelX >= pixelWidth) {
    throw new Error('PixelX is out of bounds.');
  }

  if (nValues === pixelWidth) {
    return createIndices(pixelX, pixelX, pixelX);
  }

  if (nValues > pixelWidth) {
    const nValuesPerPixel = nValues / pixelWidth;
    const start = Math.floor(pixelX * nValuesPerPixel);
    const end = Math.floor((pixelX + 1) * nValuesPerPixel) - 1;
    return createIndices(start, end, start);
  }

  if (nValues === 1) {
    return createIndices(0, 0, 0);
  }

  const relativePosition = (pixelX * nValues) / pixelWidth;
  const start = Math.floor(relativePosition);
  const end = Math.ceil(relativePosition);

  if (start === end) {
    return createIndices(start, end, start);
  }

  const pixelStart = (start * pixelWidth) / nValues;
  const pixelEnd = (end * pixelWidth) / nValues;
  const distanceStart = Math.abs(pixelX - pixelStart);
  const distanceEnd = Math.abs(pixelX - pixelEnd);
  const closest = distanceStart <= distanceEnd ? start : end;
  return createIndices(start, end, closest);
}
