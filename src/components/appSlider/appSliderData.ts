interface ISliderData {
  value: number;
  label: string;
  defaultValue: number;
  key: number;
  title: string;
}
export const marks: ISliderData[] = [
  {
    value: 0,
    label: "0",
    defaultValue: 100,
    key: 1,
    title: "lot coverage %",
  },

  {
    value: 100,
    label: "0",
    defaultValue: 80,
    key: 2,
    title: "floor number",
  },
  {
    value: 100,
    label: "0",
    defaultValue: 100,
    key: 3,
    title: "floor height",
  },
];
