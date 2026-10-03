import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS, ROUNDING, SIZES } from '../../constants/theme';
import quizData from '../../data/quiz.json';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const { incrementQuiz, quizzesCompleted } = useApp();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const isFinished = currentQuestionIdx >= quizData.length;
  // Guard: only access question after confirming we're not finished
  const question = isFinished ? null : quizData[currentQuestionIdx];

  const handleSubmit = () => {
    if (selectedOption === null || !question) return;

    if (!isSubmitted) {
      setIsSubmitted(true);
      if (selectedOption === question.answerIndex) {
        setScore(s => s + 100);
      }
    } else {
      // Move to next question
      setIsSubmitted(false);
      setSelectedOption(null);
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      if (nextIdx >= quizData.length) {
        incrementQuiz();
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  if (isFinished) {
    const totalPossible = quizData.length * 100;
    const percentage = Math.round((score / totalPossible) * 100);
    return (
      <View style={[styles.container, styles.center, { paddingTop: Math.max(insets.top, 24) }]}>
        <Text style={styles.completedEmoji}>🎉</Text>
        <Text style={styles.title}>Quiz Complete!</Text>
        <Text style={styles.scoreText}>{score} / {totalPossible} pts</Text>
        <Text style={styles.percentText}>{percentage}% correct</Text>
        <Text style={styles.statText}>Total quizzes completed: {quizzesCompleted}</Text>
        <PrimaryButton label="Play Again" onPress={resetQuiz} style={styles.playAgainBtn} />
      </View>
    );
  }

  // question is guaranteed non-null here — assert once to avoid repeated !
  const q = question!;

  return (
    <ScrollView
      style={styles.container}
      // paddingTop on contentContainerStyle (not style) so it's applied
      // inside the scroll area and doesn't clip content during bounce
      contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, 20) }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Wildlife Quiz</Text>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeText}>{score} pts</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>
          Question {currentQuestionIdx + 1} of {quizData.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestionIdx + 1) / quizData.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.card}>
        {q.image ? (
          <Image source={{ uri: q.image }} style={styles.image} />
        ) : null}
        <Text style={styles.questionText}>{q.question}</Text>

        <View style={styles.optionsList}>
          {q.options.map((opt, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = i === q.answerIndex;
            let borderColor = COLORS.border;
            let bgColor = COLORS.white;

            if (isSubmitted) {
              if (isCorrect) {
                borderColor = COLORS.status.leastConcern;
                bgColor = COLORS.status.leastConcern + '20';
              } else if (isSelected) {
                borderColor = COLORS.status.criticallyEndangered;
                bgColor = COLORS.status.criticallyEndangered + '20';
              }
            } else if (isSelected) {
              borderColor = COLORS.primary;
              bgColor = COLORS.primary + '08';
            }

            return (
              <TouchableOpacity
                key={i}
                style={[styles.option, { borderColor, backgroundColor: bgColor }]}
                onPress={() => !isSubmitted && setSelectedOption(i)}
                activeOpacity={0.7}
              >
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.optionText}>
                  {String.fromCharCode(65 + i)}. {opt}
                </Text>
                {isSubmitted && isCorrect && (
                  <Text style={styles.correctMark}>✓</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <PrimaryButton
          label={
            isSubmitted
              ? currentQuestionIdx === quizData.length - 1
                ? 'Finish Quiz'
                : 'Next Question →'
              : 'Submit Answer'
          }
          onPress={handleSubmit}
          disabled={selectedOption === null}
          style={{ opacity: selectedOption === null ? 0.5 : 1 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  completedEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.xlarge,
    color: COLORS.textPrimary,
  },
  scoreBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: ROUNDING.pill,
    borderWidth: 1,
    // Use primary (dark green) — not the semantic orange "vulnerable" colour
    borderColor: COLORS.primary,
  },
  scoreBadgeText: {
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.small,
    color: COLORS.primary,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressLabel: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: ROUNDING.large,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: ROUNDING.medium,
    marginBottom: 20,
  },
  questionText: {
    fontFamily: FONTS.serif,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
    marginBottom: 24,
    lineHeight: 32,
  },
  optionsList: {
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: ROUNDING.medium,
    borderWidth: 2,
    marginBottom: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  radioSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontFamily: FONTS.sansMedium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  correctMark: {
    color: COLORS.status.leastConcern,
    fontFamily: FONTS.sansBold,
    fontSize: SIZES.medium,
    marginLeft: 8,
  },
  scoreText: {
    fontFamily: FONTS.sansBold,
    fontSize: 36,
    color: COLORS.primary,
    marginTop: 8,
  },
  percentText: {
    fontFamily: FONTS.sansMedium,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  statText: {
    fontFamily: FONTS.sans,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  playAgainBtn: {
    width: '100%',
  },
});
