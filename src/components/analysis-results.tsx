
import type { CompareResumeToJobDescriptionOutput } from '@/ai/flows/compare-resume-to-job-description';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { RadialProgress } from './radial-progress';

type AnalysisResultsProps = {
  results: CompareResumeToJobDescriptionOutput;
};

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const { similarityScore, matchedSkills, missingSkills } = results;

  const getScoreCategory = (score: number) => {
    if (score >= 90) {
      return { title: 'Outstanding', description: "You're a near-perfect match for this role!", color: 'text-primary' };
    }
    if (score >= 80) {
      return { title: 'Excellent', description: 'You are a very strong candidate for this position.', color: 'text-green-500' };
    }
    if (score >= 50) {
      return { title: 'Good Match', description: 'Your skills align well with the job requirements.', color: 'text-yellow-500' };
    }
    if (score >= 30) {
      return { title: 'Needs Improvement', description: 'There are several areas you can improve to be a better fit.', color: 'text-orange-500' };
    }
    return { title: 'Poor Match', description: 'This role may not be the best fit based on your current resume.', color: 'text-destructive' };
  };

  const scoreCategory = getScoreCategory(similarityScore);

  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Analysis Complete</CardTitle>
        <CardDescription>Here's the breakdown of your resume against the job description.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-4">
        <div className="flex justify-center">
            <Card className="bg-muted w-full md:w-1/2">
                <CardHeader className="items-center text-center">
                    <CardTitle className="text-xl">Similarity Score</CardTitle>
                    <CardDescription className={`text-lg font-semibold ${scoreCategory.color}`}>
                        {scoreCategory.title}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center pb-8">
                     <RadialProgress progress={similarityScore} />
                </CardContent>
            </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                Matched Skills
              </h3>
              {matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No matching skills found.</p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <XCircle className="w-6 h-6 text-destructive" />
                Missing Skills
              </h3>
              {missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Great news! No critical skills seem to be missing.</p>
              )}
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
