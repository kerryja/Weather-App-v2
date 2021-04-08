import Image from "next/image";

const WeatherIcon = ({ src }) => {
  return (
    <div>
      <Image src={src[0]} alt={src[1]} width="70" height="70" />
    </div>
  );
};

export default WeatherIcon;
