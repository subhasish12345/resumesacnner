import type { CompareResumeToJobDescriptionOutput } from '@/ai/flows/compare-resume-to-job-description';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Lightbulb, XCircle } from 'lucide-react';
import { RadialProgress } from './radial-progress';

type AnalysisResultsProps = {
  results: CompareResumeToJobDescriptionOutput;
};

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const { similarityScore, matchedSkills, missingSkills, advice } = results;

  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Analysis Complete</CardTitle>
        <CardDescription>Here's the breakdown of your resume against the job description.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-muted p-6 rounded-lg">
          <div className="md:col-span-1 flex justify-center">
            <RadialProgress progress={similarityScore} />
          </div>
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-primary">
              <Lightbulb className="w-6 h-6" />
              AI-Powered Advice
            </h3>
            <p className="text-muted-foreground leading-relaxed">{advice}</p>
          </div>
        </div>

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
      </CardContent>
    </Card>
  );
}
