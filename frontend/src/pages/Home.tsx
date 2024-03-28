import { Business, CTABusiness, CTAClient, Hero, Blog, Stats } from "../components";

const Home = () => {
  return (
    <div className="xl:max-w-[1280px] w-full">
      <Hero />
      <Stats/>
      <Business/>
      <CTABusiness/>
      <CTAClient/>
      <Blog/>
    </div>
  );
};

export default Home;
