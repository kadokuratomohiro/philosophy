import { Proposition, LogicalStructure, ValidationResult } from '../types/proposition';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * 命題に関するAPI呼び出し関数群
 */
export const propositionApi = {
  /**
   * 新しい命題を作成する
   * @param text 命題のテキスト
   * @returns 作成された命題
   */
  async create(text: string): Promise<Proposition> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/propositions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create proposition:', error);
      throw error;
    }
  },

  /**
   * 命題を取得する
   * @param id 命題ID
   * @returns 取得された命題
   */
  async get(id: string): Promise<Proposition> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/propositions/${id}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get proposition:', error);
      throw error;
    }
  },

  /**
   * 命題の論理構造を解析する
   * @param text 命題のテキスト
   * @returns 論理構造
   */
  async analyze(text: string): Promise<LogicalStructure> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/propositions/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to analyze proposition:', error);
      throw error;
    }
  },

  /**
   * 命題の妥当性を検証する
   * @param id 命題ID
   * @returns 妥当性検証結果
   */
  async validate(id: string): Promise<ValidationResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/propositions/${id}/validate`);

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to validate proposition:', error);
      throw error;
    }
  },

  /**
   * 命題を更新する
   * @param id 命題ID
   * @param updates 更新内容
   * @returns 更新された命題
   */
  async update(id: string, updates: Partial<Proposition>): Promise<Proposition> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/propositions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update proposition:', error);
      throw error;
    }
  },

  /**
   * 命題を削除する
   * @param id 命題ID
   */
  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/propositions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to delete proposition:', error);
      throw error;
    }
  },
};

export default propositionApi;