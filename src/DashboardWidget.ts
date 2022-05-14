import Dashboard from 'hub-dashboard-addons';
import { ExperimentTag } from './constants';

type Fetch = <T>(...parameters: Parameters<typeof fetch>) => Promise<T> | never;

class DashboardWidget {
  private widgetApi: DashboardApi | null = null;

  private widgetFetch: Fetch | null = null;

  private userCanUseTags: boolean | null = null;

  init = (): Promise<void> => (
    Dashboard.registerWidget(async (dashboardApi, registerWidgetApi) => {
      dashboardApi.setTitle('Frontend global status');
      registerWidgetApi({
        onRefresh: () => {},
      });

      this.widgetApi = dashboardApi;
      this.widgetFetch = await this.makeFetch();
      this.userCanUseTags = await this.updateUserCanUseTag();
    }));

  get api(): DashboardApi {
    if (this.widgetApi === null) {
      throw new Error('DashboardWidget.api is not defined');
    }

    return this.widgetApi;
  }

  get fetch(): Fetch {
    if (this.widgetFetch === null) {
      throw new Error('DashboardWidget.fetch is not defined');
    }

    return this.widgetFetch;
  }

  get isUserCanUseTags(): boolean {
    if (this.userCanUseTags === null) {
      throw new Error('DashboardWidget.isUserCanUseTags is not defined');
    }

    return this.userCanUseTags;
  }

  private updateUserCanUseTag = async (): Promise<boolean> => {
    try {
      const tagsInfo = await this.fetch<{ name: string | null }[]>('api/issueTags?fields=name&$top=1000');
      const tagsNames = tagsInfo.map(({ name }) => name).filter(Boolean) as string[];
      const tags = [ExperimentTag.Create, ExperimentTag.Close, ExperimentTag.Not];

      return tags.reduce((isUserCanUseTags, tag) => {
        if (!isUserCanUseTags) {
          return false;
        }

        return tagsNames.includes(tag as string);
      }, true) as unknown as boolean;
    } catch (e) {
      return false;
    }
  };

  private makeFetch = async (): Promise<Fetch> => {
    const ytServices = await this.api.loadServices('YouTrack');
    if (ytServices.length !== 1) {
      throw new Error(`DashboardWidget.makeFetch. ytServices.length is wrong: ${JSON.stringify(ytServices)}`);
    }
    const ytServiceId = ytServices[0].id;
    return (...params) => this.api.fetch(ytServiceId, ...params);
  };
}

export default new DashboardWidget();
