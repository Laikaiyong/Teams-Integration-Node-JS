import Service from '@ember/service';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { Client } from '@microsoft/microsoft-graph-client';
import ENV from './../config/environment';

export default class TeamsService extends Service {
  msalConfig = {
    auth: {
      clientId: ENV.microsoft.AZURE_CLIENT_ID,
      clientSecret: ENV.microsoft.AZURE_CLIENT_SECRET,
      authority: `https://login.microsoftonline.com/common`,
      redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
    },
    cache: {
      cacheLocation: 'localStorage',
    },
  };
  msalInstance = new PublicClientApplication(this.msalConfig);

  constructor() {
    super(...arguments);
  }

  async initializeMsal() {
    try {
      await this.msalInstance.initialize();
      // Initialize MSAL instance
      console.log('MSAL initialized successfully');
    } catch (error) {
      console.error('Error initializing MSAL:', error);
      throw new Error('Failed to initialize MSAL');
    }
  }

  // Function to login using MSAL and acquire token
  async loginMicrosoft() {
    await this.initializeMsal(); // Ensure MSAL is initialized
    try {
      // Login request configuration
      const loginRequest = {
        scopes: ['User.Read', 'Calendars.ReadWrite'],
      };
      const loginResponse = this.msalInstance.loginPopup(loginRequest);
      console.log('Login response:', loginResponse);

      const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
        this.msalInstance,
        {
          account: loginResponse.account,
          scopes: loginRequest.scopes,
          interactionType: InteractionType.Popup,
        },
      );

      const client = Client.initWithMiddleware({ authProvider });
      console.log('Client initialized:', client);

      return client
    } catch (error) {
      console.error('Error logging in:', error);
      throw new Error('Failed to login');
    }
  }

  async scheduleMeeting(client, event) {
    try {
      const response = await client.api(`/me/events`).post(event);
      console.log('Schedule meeting response:', response);
      return response;
    } catch (error) {
      console.error('Error scheduling the meeting:', error);
      throw new Error('Failed to schedule the meeting');
    }
  }
  async listEvents(client) {
    try {
      const events = await client.api(`/me/events`).get();
      console.log('List of events obtained:', events);
      return events.value;
    } catch (error) {
      console.error('Error listing events:', error);
      throw new Error('Failed to retrieve events');
    }
  }
}
