import chroma from 'chroma-js';

const CircleButtonColor = ({
  savedColor,
  toggleColorPicker,
}: {
  savedColor: string;
  toggleColorPicker: VoidFunction;
}) => {
  const darkenColor = (rgbaColor: string | number | chroma.Color) => {
    return chroma(rgbaColor).darken(0.1).css();
  };

  return (
    <button
      className="min-w-0 w-[25px] h-[25px] p-0 rounded-full relative cursor-pointer border-none"
      style={{ backgroundColor: savedColor }}
      onClick={toggleColorPicker}
    >
      <span
        className="absolute inset-0 rounded-full z-[1]"
        style={{ border: '1px solid black' }}
      />
      <span
        className="absolute inset-[1px] rounded-full z-0"
        style={{ border: '1px solid white' }}
      />
      <span
        className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity"
        style={{ backgroundColor: darkenColor(savedColor) }}
      />
    </button>
  );
};

export default CircleButtonColor;
