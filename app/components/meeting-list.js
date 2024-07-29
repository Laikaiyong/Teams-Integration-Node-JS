import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class MeetingListComponent extends Component {
  @service('teams') teams;

  @tracked meetings = [];
  @tracked client;

  constructor() {
    super(...arguments);
    this.getAccess();
  }

  @action
  async getCalls() {
    this.meetings = await this.teams.listEvents(this.client);
  }

  @action
  async getAccess() {
    this.client = await this.teams.loginMicrosoft();
  }

  @action
  async createMeeting() {
    const newMeeting = {
      subject: 'New Meeting',
      start: {
        dateTime: '2024-07-30T10:00:00',
        timeZone: 'Pacific Standard Time',
      },
      end: {
        dateTime: '2024-07-30T11:00:00',
        timeZone: 'Pacific Standard Time',
      },
    };
    await this.teams.scheduleMeeting(this.client, newMeeting);
    this.getCalls();
  }
}
