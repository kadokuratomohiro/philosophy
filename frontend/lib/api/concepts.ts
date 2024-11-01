import axios from 'axios';

// API基本設定
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 概念の型定義
export interface Concept {
  id: string;
  name: string;
  definition: string;
  context: string;
  relatedConcepts: string[];
}

// API レスポンスの型定義
interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

/**
 * 全ての概念を取得する
 * @returns Promise<Concept[]>
 */
export async function getAllConcepts(): Promise<Concept[]> {
  try {
    const response = await axios.get<ApiResponse<Concept[]>>(`${API_BASE_URL}/api/concepts`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch concepts:', error);
    throw error;
  }
}

/**
 * 特定のIDの概念を取得する
 * @param id 概念ID
 * @returns Promise<Concept>
 */
export async function getConceptById(id: string): Promise<Concept> {
  try {
    const response = await axios.get<ApiResponse<Concept>>(`${API_BASE_URL}/api/concepts/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch concept with id ${id}:`, error);
    throw error;
  }
}

/**
 * 新しい概念を作成する
 * @param concept 作成する概念データ
 * @returns Promise<Concept>
 */
export async function createConcept(concept: Omit<Concept, 'id'>): Promise<Concept> {
  try {
    const response = await axios.post<ApiResponse<Concept>>(`${API_BASE_URL}/api/concepts`, concept);
    return response.data.data;
  } catch (error) {
    console.error('Failed to create concept:', error);
    throw error;
  }
}

/**
 * 既存の概念を更新する
 * @param id 概念ID
 * @param concept 更新する概念データ
 * @returns Promise<Concept>
 */
export async function updateConcept(id: string, concept: Partial<Concept>): Promise<Concept> {
  try {
    const response = await axios.put<ApiResponse<Concept>>(`${API_BASE_URL}/api/concepts/${id}`, concept);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to update concept with id ${id}:`, error);
    throw error;
  }
}

/**
 * 概念を削除する
 * @param id 概念ID
 * @returns Promise<void>
 */
export async function deleteConcept(id: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/api/concepts/${id}`);
  } catch (error) {
    console.error(`Failed to delete concept with id ${id}:`, error);
    throw error;
  }
}

/**
 * 関連する概念を検索する
 * @param query 検索クエリ
 * @returns Promise<Concept[]>
 */
export async function searchConcepts(query: string): Promise<Concept[]> {
  try {
    const response = await axios.get<ApiResponse<Concept[]>>(`${API_BASE_URL}/api/concepts/search`, {
      params: { q: query }
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to search concepts:', error);
    throw error;
  }
}