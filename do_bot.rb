require "cinch"
require "YAML"

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
        c.nick = "tnw_do_bot"
        c.server = 'irc.freenode.net'
        c.channels = ["#tnw_red_team"]

        @commands = load_commands
        throw"Failed to load commands file" if @commands == nil or false
    end

    on :message, /^!do (\w+)$/ do |m, word|
        puts @commands[word]
        m.reply @commands[word]
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
        @commands.each do |key, value|
            m.reply "  #{key} => \"#{value}\""
        end
    end
end

bot.start
