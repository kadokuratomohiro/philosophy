import * as d3 from 'd3';
import { Concept } from '../../types/concept';

interface ConceptNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  radius: number;
}

interface ConceptLink extends d3.SimulationLinkDatum<ConceptNode> {
  source: string | ConceptNode;
  target: string | ConceptNode;
}

export class ConceptMapVisualizer {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private width: number;
  private height: number;
  private simulation: d3.Simulation<ConceptNode, ConceptLink>;

  constructor(containerId: string, width: number, height: number) {
    this.width = width;
    this.height = height;

    // SVG要素の初期化
    this.svg = d3.select(`#${containerId}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // シミュレーションの設定
    this.simulation = d3.forceSimulation<ConceptNode>()
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d as ConceptNode).radius));
  }

  public render(concepts: Concept[]) {
    // ノードとリンクのデータを準備
    const nodes: ConceptNode[] = concepts.map(concept => ({
      id: concept.id,
      name: concept.name,
      radius: 30,
    }));

    const links: ConceptLink[] = [];
    concepts.forEach(concept => {
      concept.relatedConcepts.forEach(relatedId => {
        links.push({
          source: concept.id,
          target: relatedId,
        });
      });
    });

    // リンクの描画
    const link = this.svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1);

    // ノードの描画
    const node = this.svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('g');

    // ノードの円を追加
    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', '#69b3a2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // ノードのラベルを追加
    node.append('text')
      .text(d => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', '#fff');

    // ドラッグ機能の実装
    const drag = d3.drag<SVGGElement, ConceptNode>()
      .on('start', this.dragstarted.bind(this))
      .on('drag', this.dragged.bind(this))
      .on('end', this.dragended.bind(this));

    node.call(drag);

    // シミュレーションの更新処理
    this.simulation
      .nodes(nodes)
      .on('tick', () => {
        link
          .attr('x1', d => (d.source as ConceptNode).x!)
          .attr('y1', d => (d.source as ConceptNode).y!)
          .attr('x2', d => (d.target as ConceptNode).x!)
          .attr('y2', d => (d.target as ConceptNode).y!);

        node
          .attr('transform', d => `translate(${d.x},${d.y})`);
      });

    this.simulation.force('link', d3.forceLink<ConceptNode, ConceptLink>(links)
      .id(d => d.id)
      .distance(100));
  }

  private dragstarted(event: d3.D3DragEvent<SVGGElement, ConceptNode, unknown>, d: ConceptNode) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(event: d3.D3DragEvent<SVGGElement, ConceptNode, unknown>, d: ConceptNode) {
    d.fx = event.x;
    d.fy = event.y;
  }

  private dragended(event: d3.D3DragEvent<SVGGElement, ConceptNode, unknown>, d: ConceptNode) {
    if (!event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  public clear() {
    this.svg.selectAll('*').remove();
    this.simulation.stop();
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.svg
      .attr('width', width)
      .attr('height', height);
    this.simulation.force('center', d3.forceCenter(width / 2, height / 2));
    this.simulation.restart();
  }
}
const conceptMap = new ConceptMapVisualizer('container', 800, 600);
conceptMap.render(concepts);