export const convertToDegrees = (radians: number): number => radians * (Math.PI / 180);

export const getSegmentMidpoint = (startPoint: number, endPoint: number) =>
  (startPoint + endPoint) / 2;
