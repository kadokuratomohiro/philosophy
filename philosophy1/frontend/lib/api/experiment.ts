// frontend/lib/api/experiment.ts

// APIレスポンスの型定義
interface ExperimentResponse {
  id: string;
  title: string;
  description: string;
  scenario: string;
  variables: string[];
  conclusions: string[];
  createdAt: string;
  updatedAt: string;
}

interface CreateExperimentRequest {
  title: string;
  description: string;
  scenario: string;
  variables: string[];
}

interface UpdateExperimentRequest extends CreateExperimentRequest {
  id: string;
}

// APIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * 思考実験の一覧を取得する
 */
export async function getExperiments(): Promise<ExperimentResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/experiments`);
    if (!response.ok) {
      throw new Error('Failed to fetch experiments');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching experiments:', error);
    throw error;
  }
}

/**
 * 特定の思考実験の詳細を取得する
 */
export async function getExperiment(id: string): Promise<ExperimentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/experiments/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch experiment');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching experiment:', error);
    throw error;
  }
}

/**
 * 新しい思考実験を作成する
 */
export async function createExperiment(data: CreateExperimentRequest): Promise<ExperimentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/experiments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create experiment');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating experiment:', error);
    throw error;
  }
}

/**
 * 既存の思考実験を更新する
 */
export async function updateExperiment(data: UpdateExperimentRequest): Promise<ExperimentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/experiments/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update experiment');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating experiment:', error);
    throw error;
  }
}

/**
 * 思考実験を削除する
 */
export async function deleteExperiment(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/experiments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete experiment');
    }
  } catch (error) {
    console.error('Error deleting experiment:', error);
    throw error;
  }
}

/**
 * 思考実験の結果を分析する
 */
export async function analyzeExperiment(id: string): Promise<{
  analysis: string;
  implications: string[];
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/experiments/${id}/analyze`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to analyze experiment');
    }
    return await response.json();
  } catch (error) {
    console.error('Error analyzing experiment:', error);
    throw error;
  }
}