function getLearnerData(courseInfo, assignmentGroups, learnerSubmissions) {
    // Helper function to parse dates
    function parseDate(dateString) {
        return new Date(dateString);
    }

    // Helper function to handle division and avoid division by zero
    function safeDivide(numerator, denominator) {
        return denominator === 0 ? 0 : numerator / denominator;
    }

    // Validate assignment groups
    function validateAssignmentGroups(groups, courses) {
        const courseIds = new Set(courses.map(course => course.id));
        for (const group of groups) {
            if (!courseIds.has(group.course_id)) {
                throw new Error(`AssignmentGroup ${group.id} references an invalid Course ID ${group.course_id}`);
            }
        }
    }

    // Validate data types and handle missing values
    function validateSubmission(submission) {
        if (typeof submission.learner_id !== 'number' || typeof submission.assignment_id !== 'number') {
            throw new Error('Invalid submission data: learner_id and assignment_id must be numbers');
        }
        if (typeof submission.submission.score !== 'number') {
            throw new Error('Invalid submission data: score must be a number');
        }
    }

    // Validate and preprocess data
    validateAssignmentGroups(assignmentGroups, courseInfo);

    // Create a map for assignments and their details
    const assignmentsMap = {};
    for (const group of assignmentGroups) {
        for (const assignment of group.assignments) {
            assignmentsMap[assignment.id] = {
                points_possible: assignment.points_possible,
                due_at: parseDate(assignment.due_at),
                group_weight: group.group_weight / 100
            };
        }
    }

    // Create a map for learner submissions
    const submissionsMap = {};
    for (const submission of learnerSubmissions) {
        validateSubmission(submission);

        const assignment = assignmentsMap[submission.assignment_id];
        if (!assignment) continue; // Skip if assignment does not exist

        const submissionDate = parseDate(submission.submission.submitted_at);
        const dueDate = assignment.due_at;

        // Deduct points for late submissions
        let score = submission.submission.score;
        if (submissionDate > dueDate) {
            score *= 0.9;
        }

        // Calculate weighted score
        const percentage = safeDivide(score, assignment.points_possible);
        const weightedScore = percentage * assignment.group_weight;

        if (!submissionsMap[submission.learner_id]) {
            submissionsMap[submission.learner_id] = {
                id: submission.learner_id,
                totalScore: 0,
                totalMaxPoints: 0,
                assignments: {}
            };
        }

        const learnerData = submissionsMap[submission.learner_id];
        learnerData.totalScore += weightedScore * assignment.points_possible;
        learnerData.totalMaxPoints += assignment.points_possible * assignment.group_weight;
        learnerData.assignments[submission.assignment_id] = percentage * 100; // Convert to percentage
    }

    // Compute the final average and format output
    const result = Object.values(submissionsMap).map(learnerData => {
        const avg = safeDivide(learnerData.totalScore, learnerData.totalMaxPoints) * 100;
        const formattedData = {
            id: learnerData.id,
            avg: avg
        };

        for (const [assignmentId, percentage] of Object.entries(learnerData.assignments)) {
            formattedData[assignmentId] = percentage;
        }

        return formattedData;
    });

    return result;
}
