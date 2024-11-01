import axios from 'axios';

// APIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 可視化データの型定義
export interface TreeViewData {
  nodes: Array<{
    id: string;
    label: string;
    type: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
    label?: string;
  }>;
}

export interface ConceptNetworkData {
  nodes: Array<{
    id: string;
    label: string;
    group?: string;
  }>;
  links: Array<{
    source: string;
    target: string;
    value: number;
  }>;
}

export interface LogicDiagramData {
  elements: Array<{
    id: string;
    type: 'node' | 'edge';
    data: {
      label: string;
      [key: string]: any;
    };
    position?: {
      x: number;
      y: number;
    };
  }>;
}

// 可視化API関数
export const visualizationApi = {
  /**
   * 論理構造のツリービューデータを取得
   */
  async getTreeViewData(propositionId: string): Promise<TreeViewData> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/visualization/tree/${propositionId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tree view data:', error);
      throw error;
    }
  },

  /**
   * 概念ネットワークデータを取得
   */
  async getConceptNetworkData(conceptIds: string[]): Promise<ConceptNetworkData> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/visualization/network`,
        { conceptIds }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch concept network data:', error);
      throw error;
    }
  },

  /**
   * ロジック図表データを取得
   */
  async getLogicDiagramData(analysisId: string): Promise<LogicDiagramData> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/visualization/diagram/${analysisId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch logic diagram data:', error);
      throw error;
    }
  },

  /**
   * フローチャートデータを取得
   */
  async getFlowChartData(experimentId: string): Promise<LogicDiagramData> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/visualization/flowchart/${experimentId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch flow chart data:', error);
      throw error;
    }
  },

  /**
   * カスタム可視化データを生成
   */
  async generateCustomVisualization(
    data: any,
    options: {
      type: string;
      parameters?: Record<string, any>;
    }
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/visualization/custom`,
        {
          data,
          options,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to generate custom visualization:', error);
      throw error;
    }
  },
};

export default visualizationApi;