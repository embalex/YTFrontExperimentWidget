type DashboardApi = {
  setTitle: (title: string)=> void;
  fetchHub: typeof fetch;
  fetch: <T>(serviceId: string, ...params: Parameters<typeof fetch>) => T;
  loadServices: (serviceName: string) => Promise<({ id: string })[]>;
};

type RegisterWidgetApi = (parameters: {
  onRefresh: () => void;
}) => void;

declare module 'hub-dashboard-addons' {
  const Dashboard: {
    registerWidget: (
      value: (dashboardApi: DashboardApi, registerWidgetApi: RegisterWidgetApi) => void
    ) => Promise<void>;
  };

  export = Dashboard;
}
