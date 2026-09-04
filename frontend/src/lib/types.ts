export interface TelemetryStep {
  tier_id: string;
  tier_name: string;
  duration_ms: number;
  status: "COMPLETED" | "PASSED" | "FAILED" | "SKIPPED" | "ACTIVATED" | "CAPPED_SANDBOX" | "QUARANTINED";
  details: Record<string, any>;
}

export interface DimensionScores {
  registry_identity: number;
  operational_filings: number;
  mca_health: number;
  banking_penny_drop: number;
  document_forensics: number;
  graph_proximity: number;
}

export interface DecisionData {
  risk_tier: "TIER_1_GREEN" | "TIER_2_AMBER" | "TIER_3_RED";
  verdict: "INSTANT_LIVE_ACTIVATED" | "CONDITIONAL_APPROVAL" | "QUARANTINED";
  activation_state: string;
  drishti_score: number;
  daily_transaction_cap_inr: number;
  settlement_cycle: string;
  rolling_reserve_pct: number;
  allowed_payment_methods: string[];
  hard_failures: string[];
  action_required: string;
  audit_token: string;
  audit_manifest: Record<string, any>;
}

export interface GraphNode {
  id: string;
  name: string;
  type: "TARGET_ENTITY" | "DIRECTOR" | "STRUCK_OFF_ENTITY";
  status: string;
  risk: "NORMAL" | "LOW" | "CRITICAL" | "BLOCKED";
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
}

export interface ShellGraphData {
  has_shell_anomaly: boolean;
  flagged_clusters_count: number;
  flagged_clusters: any[];
  graph_nodes: GraphNode[];
  graph_links: GraphLink[];
  shell_penalty: number;
  verdict: string;
}

export interface RazorpayAccount {
  id: string;
  type: string;
  status: string;
  email: string;
  phone: string;
  legal_business_name: string;
  business_type: string;
  profile: any;
  notes: {
    drishti_score: string;
    risk_tier: string;
    daily_cap_inr: string;
    audit_token: string;
  };
  live_keys?: {
    key_id: string;
    key_secret: string;
  };
  sandbox_keys: {
    key_id: string;
    key_secret: string;
  };
  created_at: number;
}

export interface PipelineResult {
  merchant_summary: {
    legal_name: string;
    trade_name: string;
    pan: string;
    gstin: string;
    cin: string;
    category: string;
    bank_account_masked: string;
  };
  decision: DecisionData;
  drishti_score: number;
  dimension_scores: DimensionScores;
  tier_telemetry: TelemetryStep[];
  total_latency_ms: number;
  tier1_documents: Record<string, any>;
  tier2_validators: Record<string, any>;
  tier3_registries: Record<string, any>;
  tier4_shell_graph: ShellGraphData;
  razorpay_provisioning: {
    account: RazorpayAccount | null;
    stakeholders: any[];
    products: any;
  };
  scenario_meta?: {
    scenario_id: string;
    title: string;
    description: string;
  };
}

export interface ScenarioItem {
  scenario_id: string;
  title: string;
  description: string;
  legal_name: string;
  pan: string;
  gstin: string;
  cin: string;
}
