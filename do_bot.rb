require "cinch"
require "yaml"

    def load_commands
        commands = YAML.load_file( 'do_commands.yml' )
        commands = {} if commands == false
        return commands
    end

    def save_commands(commands)
        File.open( 'do_commands.yml', 'w' ) do |out|
            YAML.dump( commands, out )
        end
    end


bot = Cinch::Bot.new do

    configure do |c|
        c.nick = "tnw_beaker_do"
        c.server = 'irc.freenode.net'
        c.channels = ["#tnw_dev_carbon", "#tnw_dev_cobalt"]

        @commands = load_commands
        throw"Failed to load commands file" if @commands == nil or false
    end

    on :message, /^!do (\w+)$/ do |m, word|
        puts @commands[word]
        @commands[word].split("|").each { |command| m.reply command }
    end

    on :message, /^!do_set (\w+) (.*)$/ do |m, word, cmd|
        @commands[word] = cmd
        save_commands @commands
        m.reply "You stored: #{word} to do: #{cmd}"
    end

    on :message, /^!do_clear (\w+)$/ do |m, word|
        @commands.delete(word)
        save_commands @commands
        m.reply "You cleared: #{word}"
    end

    on :message, /^!do_list/ do |m|
        m.reply "AVAILABLE DO COMMANDS:"
        @commands.keys.sort.each do |key|
            m.reply "  #{key} => \"#{@commands[key]}\""
        end
    end
end

bot.start
