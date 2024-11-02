from typing import Dict, List, Optional
from datetime import datetime
import json
import logging
from dataclasses import dataclass

# 思考実験のシナリオを表すデータクラス
@dataclass
class ExperimentScenario:
    id: str
    title: str
    description: str
    variables: Dict[str, str]
    conditions: List[str]
    expected_outcomes: List[str]
    created_at: datetime
    updated_at: datetime

# 思考実験の評価結果を表すデータクラス
@dataclass
class EvaluationResult:
    is_valid: bool
    consistency_score: float
    logical_issues: List[str]
    suggestions: List[str]
    reasoning_path: List[str]

class ExperimentEngine:
    """思考実験エンジンクラス
    
    思考実験の生成、評価、分析を行うためのコアエンジン
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.template_library = {}
        self._load_templates()

    def _load_templates(self) -> None:
        """定義済みの思考実験テンプレートを読み込む"""
        try:
            with open('templates/experiment_templates.json', 'r') as f:
                self.template_library = json.load(f)
        except FileNotFoundError:
            self.logger.warning("テンプレートファイルが見つかりません")
            self.template_library = {}

    def generate_template(self, 
                        category: str, 
                        complexity: int = 1) -> Optional[ExperimentScenario]:
        """指定されたカテゴリと複雑さに基づいてテンプレートを生成

        Args:
            category: 思考実験のカテゴリ（倫理、認識論、形而上学など）
            complexity: 実験の複雑さレベル（1-5）

        Returns:
            生成されたExperimentScenarioオブジェクト、失敗時はNone
        """
        try:
            if category not in self.template_library:
                self.logger.error(f"未知のカテゴリ: {category}")
                return None

            template_base = self.template_library[category]
            scenario = ExperimentScenario(
                id=f"exp_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                title=template_base["title_template"],
                description=template_base["description_template"],
                variables={},
                conditions=template_base["base_conditions"][:complexity],
                expected_outcomes=[],
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            
            return scenario

        except Exception as e:
            self.logger.error(f"テンプレート生成エラー: {str(e)}")
            return None

    def evaluate_scenario(self, scenario: ExperimentScenario) -> EvaluationResult:
        """思考実験シナリオの論理的整合性と有効性を評価

        Args:
            scenario: 評価対象のExperimentScenarioオブジェクト

        Returns:
            評価結果を含むEvaluationResultオブジェクト
        """
        try:
            # 論理的整合性チェック
            consistency_issues = self._check_logical_consistency(scenario)
            
            # 変数の依存関係チェック
            variable_issues = self._check_variable_dependencies(scenario)
            
            # 結果の予測可能性チェック
            outcome_issues = self._check_outcome_predictability(scenario)
            
            all_issues = consistency_issues + variable_issues + outcome_issues
            
            # 総合スコアの計算
            consistency_score = 1.0 - (len(all_issues) * 0.1)
            consistency_score = max(0.0, min(1.0, consistency_score))
            
            # 改善提案の生成
            suggestions = self._generate_suggestions(all_issues)
            
            return EvaluationResult(
                is_valid=consistency_score > 0.7,
                consistency_score=consistency_score,
                logical_issues=all_issues,
                suggestions=suggestions,
                reasoning_path=self._generate_reasoning_path(scenario)
            )

        except Exception as e:
            self.logger.error(f"シナリオ評価エラー: {str(e)}")
            return EvaluationResult(
                is_valid=False,
                consistency_score=0.0,
                logical_issues=[f"評価エラー: {str(e)}"],
                suggestions=["シナリオの再構築を検討してください"],
                reasoning_path=[]
            )

    def _check_logical_consistency(self, scenario: ExperimentScenario) -> List[str]:
        """論理的整合性のチェック"""
        issues = []
        # 条件間の矛盾チェック
        for i, condition1 in enumerate(scenario.conditions):
            for condition2 in scenario.conditions[i+1:]:
                if self._are_conditions_contradictory(condition1, condition2):
                    issues.append(f"条件の矛盾: {condition1} vs {condition2}")
        return issues

    def _check_variable_dependencies(self, scenario: ExperimentScenario) -> List[str]:
        """変数の依存関係チェック"""
        issues = []
        for var_name, var_value in scenario.variables.items():
            if not self._is_variable_valid(var_name, var_value):
                issues.append(f"無効な変数定義: {var_name}")
        return issues

    def _check_outcome_predictability(self, scenario: ExperimentScenario) -> List[str]:
        """結果の予測可能性チェック"""
        issues = []
        if not scenario.expected_outcomes:
            issues.append("期待される結果が定義されていません")
        return issues

    def _generate_suggestions(self, issues: List[str]) -> List[str]:
        """問題点に基づく改善提案の生成"""
        suggestions = []
        for issue in issues:
            if "矛盾" in issue:
                suggestions.append("条件の見直しと明確化を行ってください")
            elif "変数" in issue:
                suggestions.append("変数の定義と範囲を明確にしてください")
            elif "結果" in issue:
                suggestions.append("期待される結果をより具体的に定義してください")
        return suggestions

    def _generate_reasoning_path(self, scenario: ExperimentScenario) -> List[str]:
        """思考実験の推論経路を生成"""
        path = []
        path.append(f"前提条件の確認: {len(scenario.conditions)}個の条件")
        path.append(f"変数の初期化: {len(scenario.variables)}個の変数")
        path.append("論理的推論の実行")
        path.append(f"結果の導出: {len(scenario.expected_outcomes)}個の予測")
        return path

    def _are_conditions_contradictory(self, condition1: str, condition2: str) -> bool:
        """条件間の矛盾をチェック"""
        # 実際の実装ではより複雑な論理チェックを行う
        return False

    def _is_variable_valid(self, var_name: str, var_value: str) -> bool:
        """変数の有効性をチェック"""
        return bool(var_name and var_value)