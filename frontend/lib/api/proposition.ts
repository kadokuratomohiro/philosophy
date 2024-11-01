import axios from 'axios';
import { Proposition } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 命題に関するAPI呼び出し関数群
 */

/**
 * 新しい命題を作成する
 * @param text 命題のテキスト
 * @param concepts 関連する概念のID配列
 */
export const createProposition = async (text: string, concepts: string[] = []): Promise<Proposition> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/propositions`, {
      text,
      concepts,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create proposition:', error);
    throw error;
  }
};

/**
 * 特定の命題を取得する
 * @param id 命題のID
 */
export const getProposition = async (id: string): Promise<Proposition> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/propositions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get proposition:', error);
    throw error;
  }
};

/**
 * 命題の一覧を取得する
 * @param limit 取得する命題の数
 * @param offset ページネーションのオフセット
 */
export const getPropositions = async (
  limit: number = 10,
  offset: number = 0
): Promise<{ propositions: Proposition[]; total: number }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/propositions`, {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get propositions:', error);
    throw error;
  }
};

/**
 * 命題を更新する
 * @param id 命題のID
 * @param updates 更新するフィールドと値
 */
export const updateProposition = async (
  id: string,
  updates: Partial<Omit<Proposition, 'id' | 'timestamp'>>
): Promise<Proposition> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/propositions/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Failed to update proposition:', error);
    throw error;
  }
};

/**
 * 命題を削除する
 * @param id 命題のID
 */
export const deleteProposition = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/api/propositions/${id}`);
  } catch (error) {
    console.error('Failed to delete proposition:', error);
    throw error;
  }
};

/**
 * 命題の論理構造を分析する
 * @param id 命題のID
 */
export const analyzePropositionStructure = async (id: string): Promise<Proposition> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/propositions/${id}/analyze`);
    return response.data;
  } catch (error) {
    console.error('Failed to analyze proposition structure:', error);
    throw error;
  }
};

/**
 * 命題の妥当性をチェックする
 * @param id 命題のID
 */
export const checkPropositionValidity = async (id: string): Promise<Proposition> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/propositions/${id}/validate`);
    return response.data;
  } catch (error) {
    console.error('Failed to check proposition validity:', error);
    throw error;
  }
};