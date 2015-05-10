CATS.Controller = Classify({
    init: function () {
        //other
        this.adapters = {};
        this.rules = {};
        this.utils = null;
        //models
        this.users = {};
        this.problems = {};
        this.prizes = {};
        this.contests = {};
        this.chats = {};
        this.runs = {};
        this.compilers = {};
        this.result_tables = {};
        this.last_id = 0;

        this.utils = new CATS.Utils();
    },

    add_object: function(obj) {
        this[obj.type + 's'][obj.id] = obj;
    },

    get_new_id: function() {
        return 'id_' + this.last_id++;
    },

    get_result_table: function(contest_list) {
        for (var k in this.result_tables) {
            if (this.result_tables[k].contests.equals(contest_list))
                return this.result_tables[k];
        }
        return null;
    },

    have_result_table: function(contest_list) {
        return this.get_result_table(contest_list) != null;
    },

    register_adapter: function(adapter) {
        this.adapters[adapter.name] = adapter;
    },

    register_rule: function(rule) {
        this.rules[rule.name] = rule;
    },

    adapter_process_rank_table: function(adapter_name, callback, contest_id) {
        var contest_list = (contest_id.indexOf(',') != -1) ? contest_id.split(',') : [contest_id];

        if (this.have_result_table(contest_list) > 0) {
            var result_table = this.get_result_table(contest_list);
            callback({contests: result_table.contests, table: result_table.id});
            return;
        }

        var result_table = new CATS.Model.Results_table();

        result_table.contests = contest_list;
        this.adapters[adapter_name].init(contest_list);
        this.adapters[adapter_name].parse(result_table, function () {
            var contest = CATS.App.contests[contest_list[0]];
            CATS.App.rules[contest.scoring].process(contest, result_table);
            CATS.App.add_object(result_table);
            callback({contests : contest_list, table : result_table.id });
        });
    },

    adapter_process_contests_list: function(adapter_name, callback) {
        this.adapters[adapter_name].get_contests(function (contests) {
            callback({contests : contests});
        });
    },

    get_problem_by_code: function(code) {
        var prob = null;
        $.each(this.problems, function (k, v) {
            if (v['code'] == code)
                prob = v;
        });
        return prob;
    }
});