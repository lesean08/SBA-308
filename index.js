const CourseInfo = [
    { id: 1, name: "Math" },
    { id: 2, name: "Science" }
  ];
  
  const AssignmentGroup = [
    {
      id: 1,
      name: "Homework",
      course_id: 1,
      group_weight: 40,
      assignments: [
        {
          id: 1,
          name: "Assignment 1",
          due_at: "2024-09-10T00:00:00Z",
          points_possible: 100
        },
        {
          id: 2,
          name: "Assignment 2",
          due_at: "2024-09-20T00:00:00Z",
          points_possible: 200
        }
      ]
    }
  ];
  
  const LearnerSubmission = [
    {
      learner_id: 1,
      assignment_id: 1,
      submission: {
        submitted_at: "2024-09-09T00:00:00Z",
        score: 90
      }
    },
    {
      learner_id: 1,
      assignment_id: 2,
      submission: {
        submitted_at: "2024-09-21T00:00:00Z",
        score: 150
      }
    }
  ];
  