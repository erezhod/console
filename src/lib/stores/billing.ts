import type { Client, Payload } from '@aw-labs/appwrite-console';

export class Billing {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    async listPaymentMethods(teamId: string) {
        const path = `/teams/${teamId}/payment-methods`;
        const uri = new URL(this.client.config.endpoint + path);
        return await this.client.call('GET', uri);
    }

    async createPaymentMethod(teamId: string) {
        const path = `/teams/${teamId}/payment-methods`;
        const params = {};
        const uri = new URL(this.client.config.endpoint + path);
        return await this.client.call(
            'POST',
            uri,
            {
                'content-type': 'application/json'
            },
            params
        );
    }

    async updatePaymentMethod(teamId: string, paymentMethodId: string) {
        const path = `/teams/${teamId}/payment-methods/${paymentMethodId}`;
        const uri = new URL(this.client.config.endpoint + path);
        return await this.client.call('PUT', uri, { 'content-type': 'application/json' }, {});
    }

    async updateProjectPlan(projectId: string, billingPlan: string) {
        const path = `/project/${projectId}/plan`;
        const params: Payload = {
            billingPlan
        };
        const uri = new URL(this.client.config.endpoint + path);
        return await this.client.call('patch', uri, { 'content-type': 'application/json' }, params);
    }
}