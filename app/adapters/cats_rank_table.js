CATS.Adapter.Cats_rank_table = Classify({

    init : function(contest_id, obj) {
        if (obj != undefined)
            this.obj = obj;
        this.contest_id = contest_id;
        this.name = "cats_rank_table";
        this.model = null;
    },

    parse_score_board : function(result_table) {
        var self = this;
        var obj = this.obj;
        var problem_ids = [], problem_max_points = [];

        $.each(obj.contests, function (k, con) {
            var contest = CATS.App.contests[con.id];
            if (contest == undefined)
                contest = self.add_contest();

            contest.scoring = con.scoring;
            contest.max_points = con.max_points;
            contest.start_time = con.start_date.to_date();

            $.each(con.problems, function (k, v) {
                var problem = new CATS.Model.Problem();
                $.extend(problem, v);
                problem.contest = contest.id;
                problem_ids.push(problem.id);
                problem_max_points.push(problem.max_points);
                CATS.App.add_object(problem);
                contest.add_object(problem);
            });
        });

        $.each(obj.rows, function(k, r) {
            var user = CATS.Model.User();
            user.name = r.name;
            user.id = r.id;
            user.is_remote = r.remote;
            user.role = r.state;
            user.description = r.console_url;
            user.affiliation = {name: r.t};
            CATS.App.add_object(user);
            var row = result_table.get_empty_score_board_row();
            row.user = user.id;
            row.solved_cnt = r.solved_cnt;
            row.penalty = r.penalty;
            row.place = r.place;
            for(var i = 0; i < problem_ids.length; ++i) {
                var prob = result_table.get_empty_problem_for_score_board_row();
                prob.problem = problem_ids[i];
                prob.is_solved = r.td != undefined ? r.td[i].charAt(0) == '+' : r.pt[i] == problem_max_points[i];
                prob.runs_cnt = r.td != undefined && r.td[i].throw_first_chars(1) != "" ?
                    parseInt(r.td[i].throw_first_chars(1)) :
                    0;
                if (prob.is_solved)
                    prob.runs_cnt++;
                prob.best_run_time = r.tm != undefined ? formated_hours_to_minutes(r.tm[i]) : null;
                prob.points = r.pt != undefined ? r.pt[i] : null;
                row.problems.push(prob);
            }
            result_table.score_board.push(row);
        });
    },

    add_contest: function(v) {
        var contest = CATS.Model.Contest(), contests = [];
        contest.id = "cats_rank_table_contest";
        contest.name = "cats_rank_table_contest";
        contest.scoring = "acm";
        contest.start_time = "07.11.2014 18:00".to_date();
        CATS.App.add_object(contest);
        return contest;
    },

    get_contests: function(callback) {
        this.add_contest()
        callback(["cats_rank_table_contest"]);
    },

    parse: function(result_table, callback) {
        this.parse_score_board(result_table);
        callback();
    }
});
