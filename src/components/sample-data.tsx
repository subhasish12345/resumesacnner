
'use client';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { UseFormSetValue } from 'react-hook-form';

type SampleDataProps = {
  setValue: UseFormSetValue<{ jobDescription: string; resume: string }>;
};

const samples = [
  {
    id: 'frontend',
    title: 'Senior Frontend Engineer',
    jobDescription: `We are seeking a highly skilled Senior Frontend Engineer with over 5 years of experience in building modern web applications. The ideal candidate will have deep expertise in React, TypeScript, and Next.js. You will be responsible for leading the development of our user-facing features, optimizing for performance and scalability, and mentoring junior engineers. Strong knowledge of CSS-in-JS solutions like Emotion or Styled Components is required. Experience with GraphQL and Apollo Client is a big plus. You should have a passion for creating beautiful, intuitive user interfaces and a strong understanding of UI/UX principles.`,
    resume: `**John Doe**

**Experience:**
**Lead Frontend Developer, TechCorp (2019-Present)**
- Led a team of 4 frontend developers in building a new e-commerce platform using React and Next.js.
- Architected and implemented a component library with TypeScript and Storybook, improving development speed by 30%.
- Optimized application performance, resulting in a 50% reduction in page load times.
- Worked closely with designers to implement complex user interfaces.

**Skills:**
- **Languages:** JavaScript, TypeScript, HTML, CSS
- **Frameworks/Libraries:** React, Next.js, Redux, Styled Components, Apollo Client
- **Tools:** Git, Webpack, Babel, Storybook, Figma`,
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    jobDescription: `We are looking for a Data Scientist to join our growing team. The successful candidate will have a strong background in statistical analysis, machine learning, and data modeling. You will work with large datasets to extract valuable insights, build predictive models, and help drive product decisions. Proficiency in Python and data science libraries such as Pandas, NumPy, Scikit-learn, and TensorFlow or PyTorch is essential. Experience with data visualization tools like Matplotlib or Seaborn and SQL is also required. A PhD or Master's degree in a quantitative field is preferred.`,
    resume: `**Jane Smith**

**Education:**
- M.S. in Computer Science, Stanford University

**Experience:**
**Data Scientist, Innovate Inc. (2020-Present)**
- Developed machine learning models to predict customer churn, reducing it by 15%.
- Performed exploratory data analysis on user behavior data to identify key product opportunities.
- Built and maintained data pipelines using Python and SQL.

**Skills:**
- **Languages:** Python, R, SQL
- **Libraries:** Pandas, NumPy, Scikit-learn, TensorFlow, Matplotlib
- **Tools:** Jupyter Notebook, Git, Docker, AWS Sagemaker`,
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    jobDescription: `We are hiring an experienced Product Manager to own the roadmap and execution for our core product. You will be responsible for defining product requirements, prioritizing features, and working cross-functionally with engineering, design, and marketing to bring products to market. The ideal candidate will have a proven track record of shipping successful products, excellent communication skills, and a deep understanding of agile methodologies. You must be able to translate customer needs into clear, actionable product specs. Experience in a B2B SaaS environment is a plus.`,
    resume: `**Peter Jones**

**Experience:**
**Product Manager, SaaS Solutions (2018-Present)**
- Defined and launched three major product features that resulted in a 20% increase in monthly recurring revenue (MRR).
- Managed the product backlog and ran sprint planning meetings using Jira and Agile methodologies.
- Conducted user research and competitive analysis to inform the product roadmap.

**Skills:**
- **Methodologies:** Agile, Scrum, Lean
- **Tools:** Jira, Confluence, Figma, Mixpanel
- **Core Competencies:** Product Strategy, Roadmapping, User Research, A/B Testing, Go-to-Market Strategy`,
  },
];

export function SampleData({ setValue }: SampleDataProps) {
  const handleSampleClick = (sampleId: string) => {
    const sample = samples.find((s) => s.id === sampleId);
    if (sample) {
      setValue('jobDescription', sample.jobDescription);
      setValue('resume', sample.resume);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Use Sample Data</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Don't have a job description or resume handy? Try one of our samples.
      </p>
      <div className="flex flex-wrap gap-2">
        {samples.map((sample) => (
          <Button
            key={sample.id}
            variant="outline"
            onClick={() => handleSampleClick(sample.id)}
          >
            {sample.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
