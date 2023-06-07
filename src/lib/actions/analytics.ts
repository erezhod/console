import { page } from '$app/stores';
import { user } from '$lib/stores/user';
import { ENV, MODE, VARS } from '$lib/system';
import googleAnalytics from '@analytics/google-analytics';
import { AppwriteException } from '@appwrite.io/console';
import Analytics from 'analytics';
import { get } from 'svelte/store';

const analytics = Analytics({
    app: 'appwrite',
    plugins: [
        googleAnalytics({
            measurementIds: [VARS.GOOGLE_ANALYTICS || 'G-R4YJ9JN8L4']
        })
    ]
});

export function trackEvent(name: string, data: object = null): void {
    if (!isTrackingAllowed()) {
        return;
    }

    const currentPage = get(page);
    const path = currentPage.route.id;

    if (currentPage.params?.project) {
        data = {
            ...data,
            project: currentPage.params.project
        };
    }

    if (ENV.DEV || ENV.PREVIEW) {
        console.debug(`[Analytics] Event ${name} ${path}`, data);
    } else {
        analytics.track(name, { ...data, path });
        sendEventToGrowth(name, path, data);
    }
}

export function trackError(exception: Error, event: Submit): void {
    if (exception instanceof AppwriteException && exception.type) {
        trackEvent(Submit.Error, {
            type: exception.type,
            form: event
        });
    }
}

export function trackPageView(path: string) {
    if (!isTrackingAllowed()) {
        return;
    }

    if (ENV.DEV || ENV.PREVIEW) {
        console.debug(`[Analytics] Pageview ${path}`);
    } else {
        analytics.page({
            path
        });
    }
}

function sendEventToGrowth(event: string, path: string, data: object = null): void {
    if (!VARS.GROWTH_ENDPOINT) return;
    const userStore = get(user);
    let email: string, name: string;
    if (userStore) {
        email = userStore.email;
        name = userStore.name;
    }
    fetch(`${VARS.GROWTH_ENDPOINT}/analytics`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: event,
            label: event,
            url: window.location.origin + path,
            account: MODE,
            data: {
                email,
                name,
                ...data
            }
        })
    });
}

export function isTrackingAllowed() {
    if (ENV.TEST) {
        return;
    }
    if (window.navigator?.doNotTrack) {
        if (navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes') {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

export enum Submit {
    Error = 'submit_error',
    AccountCreate = 'submit_account_create',
    AccountLogin = 'submit_account_login',
    AccountLogout = 'submit_account_logout',
    AccountRecover = 'submit_account_recover',
    AccountUpdateName = 'submit_account_update_name',
    AccountUpdateEmail = 'submit_account_update_email',
    AccountUpdatePassword = 'submit_account_update_password',
    AccountDelete = 'submit_account_delete',
    AccountDeleteSession = 'submit_account_delete_session',
    AccountDeleteAllSessions = 'submit_account_delete_all_sessions',
    UserCreate = 'submit_user_create',
    UserDelete = 'submit_user_delete',
    UserUpdateEmail = 'submit_user_update_email',
    UserUpdateLabels = 'submit_user_update_labels',
    UserUpdateName = 'submit_user_update_name',
    UserUpdatePassword = 'submit_user_update_password',
    UserUpdatePhone = 'submit_user_update_phone',
    UserUpdatePreferences = 'submit_user_update_preferences',
    UserUpdateStatus = 'submit_user_update_status',
    UserUpdateVerificationEmail = 'submit_user_update_verification_email',
    UserUpdateVerificationPhone = 'submit_user_update_verification_phone',
    OrganizationCreate = 'submit_organization_create',
    OrganizationDelete = 'submit_organization_delete',
    OrganizationUpdateName = 'submit_organization_update_name',
    ProjectCreate = 'submit_project_create',
    ProjectDelete = 'submit_project_delete',
    ProjectUpdateName = 'submit_project_update_name',
    ProjectService = 'submit_project_service',
    MemberCreate = 'submit_member_create',
    MemberDelete = 'submit_member_delete',
    MembershipUpdateStatus = 'submit_membership_update_status',
    ProviderUpdate = 'submit_provider_update',
    TeamCreate = 'submit_team_create',
    TeamDelete = 'submit_team_delete',
    TeamUpdateName = 'submit_team_update_name',
    AuthLimitUpdate = 'submit_auth_limit_update',
    AuthStatusUpdate = 'submit_auth_status_update',
    AuthPasswordHistoryUpdate = 'submit_auth_password_history_limit_update',
    AuthPasswordDictionaryUpdate = 'submit_auth_password_dictionary_update',
    SessionsLengthUpdate = 'submit_sessions_length_update',
    SessionsLimitUpdate = 'submit_sessions_limit_update',
    SessionDelete = 'submit_session_delete',
    SessionDeleteAll = 'submit_session_delete_all',
    DatabaseCreate = 'submit_database_create',
    DatabaseDelete = 'submit_database_delete',
    DatabaseUpdateName = 'submit_database_update_name',
    AttributeCreate = 'submit_attribute_create',
    AttributeUpdate = 'submit_attribute_update',
    AttributeDelete = 'submit_attribute_delete',
    DocumentCreate = 'submit_document_create',
    DocumentDelete = 'submit_document_delete',
    DocumentUpdate = 'submit_document_update',
    DocumentUpdatePermissions = 'submit_document_update_permissions',
    IndexCreate = 'submit_index_create',
    IndexDelete = 'submit_index_delete',
    CollectionCreate = 'submit_collection_create',
    CollectionDelete = 'submit_collection_delete',
    CollectionUpdateName = 'submit_collection_update_name',
    CollectionUpdatePermissions = 'submit_collection_update_permissions',
    CollectionUpdateSecurity = 'submit_collection_update_security',
    CollectionUpdateEnabled = 'submit_collection_update_enabled',
    CollectionUpdateDisplayNames = 'submit_collection_update_display_names',
    FunctionCreate = 'submit_function_create',
    FunctionDelete = 'submit_function_delete',
    FunctionUpdateName = 'submit_function_update_name',
    FunctionUpdatePermissions = 'submit_function_update_permissions',
    FunctionUpdateSchedule = 'submit_function_update_schedule',
    FunctionUpdateTimeout = 'submit_function_update_timeout',
    FunctionUpdateEvents = 'submit_function_update_events',
    DeploymentCreate = 'submit_deployment_create',
    DeploymentDelete = 'submit_deployment_delete',
    DeploymentUpdate = 'submit_deployment_update',
    ExecutionCreate = 'submit_execution_create',
    VariableCreate = 'submit_variable_create',
    VariableDelete = 'submit_variable_delete',
    VariableUpdate = 'submit_variable_update',
    KeyCreate = 'submit_key_create',
    KeyDelete = 'submit_key_delete',
    KeyUpdateName = 'submit_key_update_name',
    KeyUpdateScopes = 'submit_key_update_scopes',
    KeyUpdateExpire = 'submit_key_update_expire',
    PlatformCreate = 'submit_platform_create',
    PlatformDelete = 'submit_platform_delete',
    PlatformUpdate = 'submit_platform_update',
    DomainCreate = 'submit_domain_create',
    DomainDelete = 'submit_domain_delete',
    DomainUpdateVerification = 'submit_domain_update_verification',
    WebhookCreate = 'submit_webhook_create',
    WebhookDelete = 'submit_webhook_delete',
    WebhookUpdateSignature = 'submit_webhook_update_signature',
    WebhookUpdateUrl = 'submit_webhook_update_url',
    WebhookUpdateEvents = 'submit_webhook_update_events',
    WebhookUpdateName = 'submit_webhook_update_name',
    WebhookUpdateSecurity = 'submit_webhook_update_security',
    BucketCreate = 'submit_bucket_create',
    BucketDelete = 'submit_bucket_delete',
    BucketUpdateEnabled = 'submit_bucket_update_enabled',
    BucketUpdateName = 'submit_bucket_update_name',
    BucketUpdatePermissions = 'submit_bucket_update_permissions',
    BucketUpdateSecurity = 'submit_bucket_update_security',
    BucketUpdateFileSecurity = 'submit_bucket_update_file_security',
    BucketUpdateSize = 'submit_bucket_update_size',
    BucketUpdateCompression = 'submit_bucket_update_compression',
    BucketUpdateExtensions = 'submit_bucket_update_extensions',
    FileCreate = 'submit_file_create',
    FileDelete = 'submit_file_delete',
    FileUpdatePermissions = 'submit_file_update_permissions'
}
