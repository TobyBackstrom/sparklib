type MockCanvasOperation =
  | { method: 'moveTo'; args: [number, number] }
  | { method: 'lineTo'; args: [number, number] }
  | { method: 'beginPath'; args: [] }
  | { method: 'closePath'; args: [] };

export class MockCanvasRenderingContext2D {
  public operations: MockCanvasOperation[] = [];

  moveTo(x: number, y: number): void {
    this.operations.push({ method: 'moveTo', args: [x, y] });
  }

  lineTo(x: number, y: number): void {
    this.operations.push({ method: 'lineTo', args: [x, y] });
  }

  beginPath(): void {
    this.operations.push({ method: 'beginPath', args: [] });
  }

  closePath(): void {
    this.operations.push({ method: 'closePath', args: [] });
  }

  reset(): void {
    this.operations = [];
  }

  getOperations(): MockCanvasOperation[] {
    return [...this.operations];
  }
}
