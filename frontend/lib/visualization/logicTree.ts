import * as d3 from 'd3';
import { LogicalStructure } from '../types/proposition';

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

interface LogicTreeOptions {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  nodeRadius: number;
  fontSize: number;
}

/**
 * 論理構造をツリー形式のデータ構造に変換する
 */
export function convertLogicToTree(structure: LogicalStructure): TreeNode {
  const root: TreeNode = {
    id: 'root',
    name: 'Proposition',
    children: [
      {
        id: 'subject',
        name: structure.subject,
        children: []
      },
      {
        id: 'predicate',
        name: structure.predicate,
        children: []
      }
    ]
  };

  // 修飾語を追加
  if (structure.modifiers.length > 0) {
    const modifiersNode: TreeNode = {
      id: 'modifiers',
      name: 'Modifiers',
      children: structure.modifiers.map((modifier, index) => ({
        id: `modifier-${index}`,
        name: modifier
      }))
    };
    root.children?.push(modifiersNode);
  }

  // 関係を追加
  if (structure.relations.length > 0) {
    const relationsNode: TreeNode = {
      id: 'relations',
      name: 'Relations',
      children: structure.relations.map((relation, index) => ({
        id: `relation-${index}`,
        name: relation.type
      }))
    };
    root.children?.push(relationsNode);
  }

  return root;
}

/**
 * 論理構造ツリーを描画する
 */
export function drawLogicTree(
  containerId: string,
  data: TreeNode,
  options: Partial<LogicTreeOptions> = {}
): void {
  const defaultOptions: LogicTreeOptions = {
    width: 800,
    height: 600,
    margin: { top: 20, right: 90, bottom: 30, left: 90 },
    nodeRadius: 10,
    fontSize: 12,
    ...options
  };

  // SVG要素の作成
  const svg = d3.select(`#${containerId}`)
    .append('svg')
    .attr('width', defaultOptions.width)
    .attr('height', defaultOptions.height);

  const g = svg.append('g')
    .attr('transform', `translate(${defaultOptions.margin.left},${defaultOptions.margin.top})`);

  // ツリーレイアウトの設定
  const treeLayout = d3.tree<TreeNode>()
    .size([
      defaultOptions.height - defaultOptions.margin.top - defaultOptions.margin.bottom,
      defaultOptions.width - defaultOptions.margin.left - defaultOptions.margin.right
    ]);

  // データの階層構造を作成
  const root = d3.hierarchy(data);
  const treeData = treeLayout(root);

  // リンク（枝）の描画
  const links = g.selectAll('.link')
    .data(treeData.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x))
    .style('fill', 'none')
    .style('stroke', '#555')
    .style('stroke-width', 1.5);

  // ノードの描画
  const nodes = g.selectAll('.node')
    .data(treeData.descendants())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.y},${d.x})`);

  // ノードの円を描画
  nodes.append('circle')
    .attr('r', defaultOptions.nodeRadius)
    .style('fill', '#fff')
    .style('stroke', '#555')
    .style('stroke-width', 2);

  // ノードのテキストを描画
  nodes.append('text')
    .attr('dy', '.31em')
    .attr('x', d => d.children ? -defaultOptions.nodeRadius - 5 : defaultOptions.nodeRadius + 5)
    .style('text-anchor', d => d.children ? 'end' : 'start')
    .style('font-size', `${defaultOptions.fontSize}px`)
    .text(d => d.data.name);
}

/**
 * ツリービューを更新する
 */
export function updateLogicTree(
  containerId: string,
  structure: LogicalStructure,
  options?: Partial<LogicTreeOptions>
): void {
  // 既存のSVGを削除
  d3.select(`#${containerId}`).selectAll('*').remove();
  
  // 新しいツリーを描画
  const treeData = convertLogicToTree(structure);
  drawLogicTree(containerId, treeData, options);
}