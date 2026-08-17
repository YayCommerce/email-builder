import AddonsLayout from '@src/features/addons/main';
import DashboardContentLayout from '@src/layouts/dashboard-content';

const Addons = () => {
  return (
    <DashboardContentLayout title="" className="yaymail-addons">
      <AddonsLayout />
    </DashboardContentLayout>
  );
};
export default Addons;
