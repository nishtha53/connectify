import { SpinnerCircularFixed } from "spinners-react";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center mt-20">
      <SpinnerCircularFixed
        size={50}
        thickness={180}
        speed={136}
        color="#4299E1"
      />
    </div>
  );
};