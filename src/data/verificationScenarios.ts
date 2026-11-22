export type ScenarioId = 'social-ownership' | 'minimum-activity' | 'eligibility';
export type OutcomeType = 'pass' | 'fail';
export type TabId = 'dashboard' | 'verify' | 'results' | 'privacy';

export interface SharedField {
  label: string;
  passValue: string;
  failValue: string;
}

export interface PrivateField {
  label: string;
  sampleHiddenValue: string;
  whyPrivate: string;
}

export interface ProfileVariant {
  label: string;
  sampleDisplay: string;
  claimOutput: string;
  reason: string;
  privateFields?: PrivateField[];
  rawSamplePreview?: Record<string, string | number | boolean>;
}

export interface VerificationScenario {
  id: ScenarioId;
  title: string;
  shortLabel: string;
  category: string;
  sourcePlatform: string;
  summary: string;
  claimRule: string;
  profiles: Record<OutcomeType, ProfileVariant>;
  sharedFields: SharedField[];
  privateFields: PrivateField[];
  rawSamplePreview: Record<string, string | number | boolean>;
  howItWorksNote: string;
}

export interface DemoResult {
  scenarioId: ScenarioId;
  title: string;
  category: string;
  sourcePlatform: string;
  outcome: OutcomeType;
  profileLabel: string;
  claimRule: string;
  claimOutput: string;
  reason: string;
  sharedFields: SharedField[];
  privateFields: PrivateField[];
  proofId: string;
  timestamp: string;
  createdAtIso: string;
  integrityHash: string;
}

export const SIMULATION_STEPS: readonly string[] = [
  'Loading local sample profile',
  'Simulating encrypted session check',
  'Filtering out private personal fields',
  'Preparing minimal proof receipt',
];

export const VERIFICATION_SCENARIOS: VerificationScenario[] = [
  {
    id: 'social-ownership',
    title: 'Social Account Ownership',
    shortLabel: 'Social Ownership',
    category: 'Identity Claim',
    sourcePlatform: 'Sample Social Network',
    summary:
      'Prove you control an active social profile without exposing your login email, phone number, or private messages.',
    claimRule: 'Account status is Active AND handle matches claimed profile',
    profiles: {
      pass: {
        label: 'Active Sample Profile',
        sampleDisplay: '@maya.creates · Active account · Linked email hidden',
        claimOutput: 'Verified: Controls an active social profile',
        reason:
          'Simulated check confirmed active account ownership while keeping account email, phone number, and follower list private.',
      },
      fail: {
        label: 'Inactive Sample Profile',
        sampleDisplay: '@temp_guest04 · Suspended status · Linked email hidden',
        claimOutput: 'Unsuccessful: Active ownership criteria not met',
        reason:
          'The sample account status is currently suspended, so active ownership could not be verified.',
        rawSamplePreview: {
          accountId: 'usr_10492_sample',
          handle: '@temp_guest04',
          email: 'guest04.demo@example.org',
          phone: '+234-800-000-0104',
          status: 'suspended',
          followers: 12,
          directMessageThreads: 0,
        },
      },
    },
    sharedFields: [
      {
        label: 'Ownership Confirmed',
        passValue: 'Yes (Active Profile)',
        failValue: 'No (Status Suspended)',
      },
      {
        label: 'Source Category',
        passValue: 'Social Profile Check',
        failValue: 'Social Profile Check',
      },
    ],
    privateFields: [
      {
        label: 'Account Email & Phone Number',
        sampleHiddenValue: 'maya.demo@example.org · +234-800-000-0199',
        whyPrivate:
          'Verifiers only need to confirm account control, not how to reach you.',
      },
      {
        label: 'Direct Messages & Follower Graph',
        sampleHiddenValue: '1,420 followers · 84 private message threads',
        whyPrivate:
          'Conversations and social connections stay completely off the verification output.',
      },
      {
        label: 'Passwords & Session Tokens',
        sampleHiddenValue: 'Browser session secret (never requested)',
        whyPrivate:
          'ProofPocket never asks for passwords, API keys, or live login tokens.',
      },
    ],
    rawSamplePreview: {
      accountId: 'usr_90841_sample',
      handle: '@maya.creates',
      email: 'maya.demo@example.org',
      phone: '+234-800-000-0199',
      status: 'active',
      followers: 1420,
      directMessageThreads: 84,
    },
    howItWorksNote:
      'Inspired by Primus zkTLS: instead of granting broad OAuth read access or sharing full screenshots, a user demonstrates a specific fact from a web session while hiding unrelated profile details.',
  },
  {
    id: 'minimum-activity',
    title: 'Minimum Account Activity',
    shortLabel: 'Account Activity',
    category: 'Threshold Proof',
    sourcePlatform: 'Sample Creator Portal',
    summary:
      'Prove your account meets a minimum age and contribution threshold (90+ days and 25+ posts) without revealing your exact history.',
    claimRule: 'Account age >= 90 days AND total contributions >= 25',
    profiles: {
      pass: {
        label: 'Established Member Sample',
        sampleDisplay: '412 days tenure · 64 posts · Exact dates hidden',
        claimOutput: 'Verified: Meets 90-day & 25-post threshold',
        reason:
          'Simulated threshold check confirmed both minimum age and contribution volume without exposing exact join dates or post contents.',
      },
      fail: {
        label: 'New Account Sample',
        sampleDisplay: '14 days tenure · 4 posts · Exact dates hidden',
        claimOutput: 'Unsuccessful: Below minimum activity threshold',
        reason:
          'This sample profile has 14 days of tenure and 4 posts, falling short of the 90-day and 25-post minimum.',
        privateFields: [
          {
            label: 'Exact Account Creation Date',
            sampleHiddenValue: 'Joined November 5, 2026 (14 days ago)',
            whyPrivate:
              'Threshold proofs return a Yes/No boundary check rather than revealing exact timestamps.',
          },
          {
            label: 'Exact Post Count & Timeline',
            sampleHiddenValue: '4 published posts · 1 draft · engagement stats',
            whyPrivate:
              'Prevents external platforms from profiling or scraping your activity history.',
          },
          {
            label: 'Device & Login Location Logs',
            sampleHiddenValue: 'Recent login city and browser metadata',
            whyPrivate:
              'Location and device telemetry remain strictly separated from the proof receipt.',
          },
        ],
        rawSamplePreview: {
          memberSince: '2026-11-05',
          accountAgeDays: 14,
          totalPosts: 4,
          draftPosts: 1,
          lastLoginRegion: 'Lagos, NG',
        },
      },
    },
    sharedFields: [
      {
        label: '90-Day Tenure Requirement',
        passValue: 'Met (>= 90 days)',
        failValue: 'Not Met (< 90 days)',
      },
      {
        label: '25-Post Contribution Minimum',
        passValue: 'Met (>= 25 posts)',
        failValue: 'Not Met (< 25 posts)',
      },
    ],
    privateFields: [
      {
        label: 'Exact Account Creation Date',
        sampleHiddenValue: 'Joined October 2, 2025 (412 days ago)',
        whyPrivate:
          'Threshold proofs return a Yes/No boundary check rather than revealing exact timestamps.',
      },
      {
        label: 'Exact Post Count & Timeline',
        sampleHiddenValue: '64 published posts · 9 drafts · engagement stats',
        whyPrivate:
          'Prevents external platforms from profiling or scraping your activity history.',
      },
      {
        label: 'Device & Login Location Logs',
        sampleHiddenValue: 'Recent login city and browser metadata',
        whyPrivate:
          'Location and device telemetry remain strictly separated from the proof receipt.',
      },
    ],
    rawSamplePreview: {
      memberSince: '2025-10-02',
      accountAgeDays: 412,
      totalPosts: 64,
      draftPosts: 9,
      lastLoginRegion: 'Lagos, NG',
    },
    howItWorksNote:
      'Threshold checks help communities deter spam and bots by confirming established standing without forcing users to expose their full chronological activity.',
  },
  {
    id: 'eligibility',
    title: 'Eligibility Verification',
    shortLabel: 'Eligibility Check',
    category: 'Access Proof',
    sourcePlatform: 'Sample Grants & Learning Hub',
    summary:
      'Prove you qualify for a program or community tier without revealing your full legal name, ID number, or exact balance.',
    claimRule: 'Program Status = Enrolled AND Tier >= Standard',
    profiles: {
      pass: {
        label: 'Eligible Participant Sample',
        sampleDisplay: 'Enrolled status · Gold tier · Legal identity hidden',
        claimOutput: 'Verified: Eligible for standard program tier',
        reason:
          'Simulated eligibility check confirmed active enrollment and qualifying tier without sharing identity documents or exact balances.',
      },
      fail: {
        label: 'Unenrolled Guest Sample',
        sampleDisplay: 'Guest status · No active tier · Legal identity hidden',
        claimOutput: 'Unsuccessful: Enrollment criteria not met',
        reason:
          'This sample profile has Guest status with no active enrollment, so program eligibility could not be confirmed.',
        privateFields: [
          {
            label: 'Full Legal Name & Guest ID',
            sampleHiddenValue: 'Amaka B. Guest · Guest #GST-1042 (Not Enrolled)',
            whyPrivate:
              'Proving eligibility does not require publishing your real-world name or account ID.',
          },
          {
            label: 'Exact Grant Balance or Stipend',
            sampleHiddenValue: '$0.00 USD (No active grant or stipend)',
            whyPrivate:
              'Only tier qualification is checked; financial figures stay confidential.',
          },
          {
            label: 'Home Address & Date of Birth',
            sampleHiddenValue: '28 Demo Avenue · DOB 2001-08-24',
            whyPrivate:
              'Data minimization lowers identity exposure and keeps sensitive records private.',
          },
        ],
        rawSamplePreview: {
          fullName: 'Amaka B. Guest',
          guestId: 'GST-1042',
          enrollmentStatus: 'guest',
          tier: 'None',
          stipendBalanceUsd: 0,
          dateOfBirth: '2001-08-24',
        },
      },
    },
    sharedFields: [
      {
        label: 'Program Eligibility',
        passValue: 'Eligible (Criteria Met)',
        failValue: 'Not Eligible',
      },
      {
        label: 'Qualifying Tier Check',
        passValue: 'Standard Tier or Higher',
        failValue: 'No Qualifying Tier',
      },
    ],
    privateFields: [
      {
        label: 'Full Legal Name & Student ID',
        sampleHiddenValue: 'Tunde A. Demo · ID #STD-44920',
        whyPrivate:
          'Proving eligibility does not require publishing your real-world name or ID number.',
      },
      {
        label: 'Exact Grant Balance or Stipend',
        sampleHiddenValue: '$420.50 USD equivalent',
        whyPrivate:
          'Only tier qualification is checked; financial figures stay confidential.',
      },
      {
        label: 'Home Address & Date of Birth',
        sampleHiddenValue: '14 Sample Crescent · DOB 1999-05-12',
        whyPrivate:
          'Data minimization lowers identity exposure and keeps sensitive records private.',
      },
    ],
    rawSamplePreview: {
      fullName: 'Tunde A. Demo',
      studentId: 'STD-44920',
      enrollmentStatus: 'enrolled',
      tier: 'Gold',
      stipendBalanceUsd: 420.5,
      dateOfBirth: '1999-05-12',
    },
    howItWorksNote:
      'Selective disclosure allows learners and grant applicants to verify program status directly instead of uploading sensitive PDF documents or identity scans.',
  },
];
