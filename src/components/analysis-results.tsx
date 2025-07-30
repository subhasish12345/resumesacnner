
import type { CompareResumeToJobDescriptionOutput } from '@/ai/flows/compare-resume-to-job-description';
import { Badge } from '@/components/ui/badge';
import { Bot, CheckCircle2, Lightbulb, User, XCircle } from 'lucide-react';
import { RadialProgress } from './radial-progress';

type AnalysisResultsProps = {
  results: CompareResumeToJobDescriptionOutput;
};

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

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const { similarityScore, matchedSkills, missingSkills, suggestion } = results;
  const scoreCategory = getScoreCategory(similarityScore);

  return (
    <div className="flex justify-center">
      <div
        className="profile-card w-[400px] rounded-md shadow-xl overflow-hidden z-[100] relative cursor-pointer snap-start shrink-0 bg-card flex flex-col items-center justify-center gap-3 transition-all duration-300 group"
      >
        <div
          className="avatar w-full pt-5 flex items-center justify-center flex-col gap-1"
        >
          <div
            className="img_container w-full flex items-center justify-center relative z-40 after:absolute after:h-[6px] after:w-full after:bg-primary after:top-4 after:group-hover:size-[1%] after:delay-300 after:group-hover:delay-0 after:group-hover:transition-all after:group-hover:duration-300 after:transition-all after:duration-300 before:absolute before:h-[6px] before:w-full before:bg-primary before:bottom-4 before:group-hover:size-[1%] before:delay-300 before:group-hover:delay-0 before:group-hover:transition-all before:group-hover:duration-300 before:transition-all before:duration-300"
          >
            <div className="relative size-36 z-40 border-4 border-card rounded-full group-hover:border-8 group-hover:transition-all group-hover:duration-300 transition-all duration-300 flex items-center justify-center">
                <RadialProgress progress={similarityScore} size={120} strokeWidth={8} />
            </div>
            <div
              className="absolute bg-primary z-10 size-[60%] w-full group-hover:size-[1%] group-hover:transition-all group-hover:duration-300 transition-all duration-300 delay-700 group-hover:delay-0"
            ></div>
          </div>
        </div>
        <div className="headings *:text-center *:leading-4 p-4">
          <p className="text-xl font-serif font-semibold text-foreground">Your Resume Analysis</p>
          <p className={`text-sm font-semibold ${scoreCategory.color}`}>{scoreCategory.title}</p>
        </div>
        <div className="w-full items-center justify-center flex px-6">
          <ul
            className="w-full flex flex-col items-start gap-3 pb-3"
          >
            <li className="w-full inline-flex gap-2 items-start justify-start border-b-[1.5px] border-b-stone-700 border-dotted text-xs font-semibold text-foreground">
              <CheckCircle2 className="text-primary w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1.5">
                <p className="text-sm">Matched Skills</p>
                {matchedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                        {skill}
                        </Badge>
                    ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground font-normal">No matching skills found.</p>
                )}
              </div>
            </li>
            <li className="w-full inline-flex gap-2 items-start justify-start border-b-[1.5px] border-b-stone-700 border-dotted text-xs font-semibold text-foreground">
                <XCircle className="text-destructive w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5">
                    <p className="text-sm">Missing Skills</p>
                    {missingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                        {missingSkills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                            {skill}
                            </Badge>
                        ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground font-normal">Great news! No critical skills seem to be missing.</p>
                    )}
                </div>
            </li>
            <li className="w-full inline-flex gap-2 items-start justify-start border-b-[1.5px] border-b-stone-700 border-dotted text-xs font-semibold text-foreground">
                <Lightbulb className="text-yellow-500 w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5">
                    <p className="text-sm">AI Suggestion</p>
                    <p className="text-muted-foreground font-normal leading-relaxed">{suggestion}</p>
                </div>
            </li>
            <li className="w-full inline-flex gap-2 items-start justify-start border-b-[1.5px] border-b-stone-700 border-dotted text-xs font-semibold text-foreground last:border-b-0">
                <Bot className="text-foreground w-5 h-5 shrink-0 mt-0.5" />
                 <div className="flex flex-col gap-1.5">
                    <p className="text-sm">Developer</p>
                    <p className="text-muted-foreground font-normal">SUBHU</p>
                </div>
            </li>
          </ul>
        </div>
        <hr
          className="w-full group-hover:h-5 h-3 bg-primary group-hover:transition-all group-hover:duration-300 transition-all duration-300"
        />
      </div>
    </div>
  );
}
