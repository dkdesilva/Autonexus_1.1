import AdOverviewStatChart from './AdOverviewStatChart';
import DashboardStatCard from './DashboardStatCard';
import RecentUsers from './RecentUsers';
import UserStatChart from './UserStatChart';

const DashboardContent = () => {
  return (
    <>
      <DashboardStatCard/>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentUsers/>
        <UserStatChart/>
      </div>
      <AdOverviewStatChart/>
    </>
  );
};

export default DashboardContent;