import { MdOutlineHandyman, MdCoPresent } from "react-icons/md";
import { TbContract } from "react-icons/tb";
import frame1 from "../assets/frame1-bg.png";
import frame2 from "../assets/frame2-bg.png";
import frame3 from "../assets/frame3-bg.png";

const cards = [
  {
    title: "Tools & Resources",
    icon: <MdOutlineHandyman className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
    background: frame1,
  },
  {
    title: "Training & Onboarding",
    icon: <MdCoPresent className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
    background: frame2,
  },
  {
    title: "Company Policies",
    icon: <TbContract className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
    background: frame3,
  },
];

export default function CardSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`relative p-4 text-white cursor-pointer bg-cover bg-center rounded-2xl
                      w-full max-w-[200px] h-[100px] sm:max-w-[226px] sm:h-[129px]
                      ${index === 2 ? "sm:col-span-2 md:col-span-1" : ""}
                      flex flex-col justify-between items-center mx-auto`}
          style={{ backgroundImage: `url(${card.background})` }}
        >
          <h3 className="text-sm sm:text-base font-semibold leading-tight tracking-tight text-center">
            {card.title}
          </h3>
          <div className="self-start">{card.icon}</div>
        </div>
      ))}
    </div>
  );
}
