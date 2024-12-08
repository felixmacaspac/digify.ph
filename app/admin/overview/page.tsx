import CameraBrandsChart from "@/components/charts/camera-brands-chart";
import { UserSignUps } from "@/components/charts/user-signups";

const Overview = () => {
  return (
    <div className="w-full">
      <h1 className="text-3xl text-black font-bold">OVERVIEW</h1>
      <div className="grid grid-cols-2 gap-10 h-full mt-14">
        <UserSignUps />
        <CameraBrandsChart />
      </div>
    </div>
  );
};

export default Overview;
