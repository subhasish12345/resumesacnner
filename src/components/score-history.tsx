
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ScoreRecord } from '@/app/actions';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

type ScoreHistoryProps = {
  scores: ScoreRecord[];
};

const getBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
  if (score >= 80) return 'default';
  if (score >= 50) return 'secondary';
  return 'destructive';
};


export function ScoreHistory({ scores }: ScoreHistoryProps) {
  if (scores.length === 0) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Score History</CardTitle>
                <CardDescription>
                Your past resume analysis scores will appear here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-center">No scores recorded yet. Run an analysis to get started!</p>
            </CardContent>
        </Card>
    );
  }
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <CardHeader className="p-0 text-left">
            <CardTitle>View Score History</CardTitle>
            <CardDescription>
              Check your previously recorded scores.
            </CardDescription>
          </CardHeader>
        </AccordionTrigger>
        <AccordionContent>
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">Trend</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scores.map((score, index) => {
                    const previousScore = scores[index + 1]?.score;
                    const trend =
                      previousScore !== undefined
                        ? score.score > previousScore
                          ? 'up'
                          : score.score < previousScore
                          ? 'down'
                          : 'same'
                        : 'same';

                    return (
                      <TableRow key={score.id}>
                        <TableCell className="font-medium">
                          {score.jobTitle}
                        </TableCell>
                        <TableCell className="text-center">
                           <Badge variant={getBadgeVariant(score.score)} className="text-lg font-bold">
                            {score.score}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {trend === 'up' && (
                            <TrendingUp className="w-5 h-5 text-green-500 mx-auto" />
                          )}
                          {trend === 'down' && (
                            <TrendingDown className="w-5 h-5 text-red-500 mx-auto" />
                          )}
                          {trend === 'same' && (
                            <Minus className="w-5 h-5 text-gray-500 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">{score.date}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
